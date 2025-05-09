"use client";

import { useState } from "react";
import { Alert, Button, Input, Link, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { MuxedAccountResult } from "@/components/MuxedAccountResult";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SdsLink } from "@/components/SdsLink";
import { PageCard } from "@/components/layout/PageCard";

import { muxedAccount } from "@/helpers/muxedAccount";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import { validate } from "@/validate";

import "../styles.scss";

export default function CreateMuxedAccount() {
  const { account } = useStore();

  const [baseAddress, setBaseAddress] = useState<string>(
    account.generatedMuxedAccountInput?.baseAddress || "",
  );
  const [muxedId, setMuxedId] = useState<string>(
    account.generatedMuxedAccountInput?.id || "",
  );
  const [baseFieldErrorMessage, setBaseFieldErrorMessage] =
    useState<string>("");
  const [muxedFieldError, setMuxedFieldError] = useState<string>("");
  const [sdkError, setSdkError] = useState<string>("");

  const [isReset, setReset] = useState<boolean>(false);

  const generateMuxedAccount = () => {
    const result = muxedAccount.generate({
      baseAddress,
      muxedAccountId: muxedId,
    });

    const { error, muxedAddress } = result;

    if (muxedAddress) {
      setReset(false);
      account.updateGeneratedMuxedAccount({
        id: muxedId,
        baseAddress,
        muxedAddress,
      });

      account.updateGeneratedMuxedAccountInput({
        id: muxedId,
        baseAddress,
      });

      trackEvent(TrackingEvent.ACCOUNT_MUXED_CREATE);

      setSdkError("");
      return;
    }

    if (error) {
      setSdkError(error);
      return;
    }
  };

  return (
    <div className="Account">
      <PageCard
        heading="Create Multiplexed Account"
        headingInfoLink="https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/pooled-accounts-muxed-accounts-memos"
      >
        <div className="Account__card">
          <Text size="sm" as="div">
            A muxed (or multiplexed) account (defined in{" "}
            <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md">
              CAP-27
            </SdsLink>{" "}
            and briefly{" "}
            <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md">
              SEP-23
            </SdsLink>
            ) is one that resolves a single Stellar G...account to many
            different underlying IDs.
          </Text>

          <PubKeyPicker
            id="muxed-public-key"
            label="Base Account G Address"
            value={baseAddress}
            onChange={(e) => {
              setReset(true);
              setBaseAddress(e.target.value);

              let error = "";

              if (!e.target.value.startsWith("G")) {
                error = "Base account address should start with G";
              } else {
                error = validate.getPublicKeyError(e.target.value) || "";
              }

              setBaseFieldErrorMessage(error);
            }}
            error={baseFieldErrorMessage}
            copyButton={{
              position: "right",
            }}
          />

          <Input
            id="muxed-account-id"
            fieldSize="md"
            placeholder="Ex: 1"
            label="Muxed Account ID"
            value={muxedId}
            onChange={(e) => {
              setReset(true);
              setMuxedId(e.target.value);

              const error = validate.getPositiveIntError(e.target.value);
              setMuxedFieldError(error || "");
            }}
            error={muxedFieldError}
            copyButton={{
              position: "right",
            }}
          />

          <div className="Account__CTA">
            <Button
              disabled={
                !baseAddress ||
                !muxedId ||
                Boolean(baseFieldErrorMessage || muxedFieldError)
              }
              size="md"
              variant={"secondary"}
              onClick={generateMuxedAccount}
            >
              Create
            </Button>
          </div>

          <ExpandBox
            offsetTop="xl"
            isExpanded={
              !isReset && Boolean(account.generatedMuxedAccount.muxedAddress)
            }
          >
            <MuxedAccountResult
              baseAddress={account.generatedMuxedAccount.baseAddress ?? ""}
              muxedAddress={account.generatedMuxedAccount.muxedAddress ?? ""}
              muxedId={account.generatedMuxedAccount.id ?? ""}
            />
          </ExpandBox>
        </div>
      </PageCard>

      <Alert
        placement="inline"
        variant="warning"
        title="Muxed accounts are uncommon"
      >
        Don’t use in a production environment unless you know what you’re doing.
        Read more about Muxed accounts{" "}
        <Link href="https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/pooled-accounts-muxed-accounts-memos#muxed-accounts">
          here
        </Link>
        .
      </Alert>

      {Boolean(sdkError) && (
        <Alert
          placement="inline"
          variant="error"
          onClose={() => {
            setSdkError("");
          }}
          title={sdkError}
        >
          {""}
        </Alert>
      )}
    </div>
  );
}
