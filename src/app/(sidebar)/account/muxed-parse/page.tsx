"use client";

import { useState } from "react";
import { Alert, Link, Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { MuxedAccountResult } from "@/components/MuxedAccountResult";
import { PageCard } from "@/components/layout/PageCard";

import { muxedAccount } from "@/helpers/muxedAccount";

import { validate } from "@/validate";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

import "../styles.scss";

export default function ParseMuxedAccount() {
  const { account } = useStore();
  const parsedMuxedAccount = account.parsedMuxedAccount;

  const [muxedAddress, setMuxedAddress] = useState<string>(
    account.parsedMuxedAccountInput || "",
  );

  const [muxedFieldError, setMuxedFieldError] = useState<string>("");
  const [sdkError, setSdkError] = useState<string>("");

  const [isReset, setReset] = useState<boolean>(false);

  const parseMuxedAccount = () => {
    const result = muxedAccount.parse({
      muxedAddress,
    });

    const { error, id, baseAddress } = result;

    if (baseAddress && id) {
      setReset(false);
      account.updateParsedMuxedAccount({
        id,
        baseAddress,
        muxedAddress,
      });
      account.updateParsedMuxedAccountInput(muxedAddress);

      trackEvent(TrackingEvent.ACCOUNT_MUXED_PARSE);

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
        heading="Get Muxed Account from M address"
        headingInfoLink="https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/pooled-accounts-muxed-accounts-memos"
      >
        <div className="Account__card">
          <PubKeyPicker
            id="muxed-account-address"
            label="Muxed Account M Address"
            placeholder="Ex: MBRWSVNURRYVIYSWLRFQ5AAAUWPKOZZNZVVVIXHFGUSGIRVKLVIDYAAAAAAAAAAD5GJ4U"
            value={muxedAddress}
            error={muxedFieldError}
            copyButton={{
              position: "right",
            }}
            onChange={(e) => {
              setReset(true);
              setMuxedAddress(e.target.value);

              let error = "";

              if (!e.target.value.startsWith("M")) {
                error = "Muxed account address should start with M";
              } else {
                error = validate.getPublicKeyError(e.target.value) || "";
              }

              setMuxedFieldError(error);
            }}
          />

          <div className="Account__CTA">
            <Button
              disabled={!muxedAddress || Boolean(muxedFieldError)}
              size="md"
              variant={"secondary"}
              onClick={parseMuxedAccount}
            >
              Parse
            </Button>
          </div>

          <ExpandBox
            offsetTop="xl"
            isExpanded={
              !isReset &&
              Boolean(
                parsedMuxedAccount?.baseAddress &&
                  parsedMuxedAccount?.id &&
                  parsedMuxedAccount?.muxedAddress,
              )
            }
          >
            <MuxedAccountResult
              baseAddress={parsedMuxedAccount.baseAddress ?? ""}
              muxedId={parsedMuxedAccount.id ?? ""}
              muxedAddress={parsedMuxedAccount.muxedAddress ?? ""}
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
