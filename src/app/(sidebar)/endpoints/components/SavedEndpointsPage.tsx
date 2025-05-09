import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Icon,
  Input,
  Modal,
  Text,
} from "@stellar/design-system";
import { stringify } from "lossless-json";

import { TabView } from "@/components/TabView";
import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { NextLink } from "@/components/NextLink";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { PrettyJsonTextarea } from "@/components/PrettyJsonTextarea";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";
import { CopyJsonPayloadButton } from "@/components/CopyJsonPayloadButton";
import { PageCard } from "@/components/layout/PageCard";
import { SaveToLocalStorageModal } from "@/components/SaveToLocalStorageModal";
import { JsonCodeWrapToggle } from "@/components/JsonCodeWrapToggle";

import { Routes } from "@/constants/routes";
import { localStorageSavedEndpointsHorizon } from "@/helpers/localStorageSavedEndpointsHorizon";
import { localStorageSavedRpcMethods } from "@/helpers/localStorageSavedRpcMethods";
import { arrayItem } from "@/helpers/arrayItem";
import { formatTimestamp } from "@/helpers/formatTimestamp";
import { getNetworkById } from "@/helpers/getNetworkById";
import { useCodeWrappedSetting } from "@/hooks/useCodeWrappedSetting";
import { useStore } from "@/store/useStore";

import { trackEvent, TrackingEvent } from "@/metrics/tracking";
import {
  Network,
  SavedEndpointHorizon,
  SavedRpcMethod,
  LocalStorageSavedNetwork,
} from "@/types/types";

export const SavedEndpointsPage = () => {
  const { endpoints, network, selectNetwork, updateIsDynamicNetworkSelect } =
    useStore();
  const { saved, updateSavedActiveTab, setParams } = endpoints;
  const router = useRouter();

  const [savedEndpointsHorizon, setSavedEndpointsHorizon] = useState<
    SavedEndpointHorizon[]
  >([]);
  const [savedRpcMethods, setSavedRpcMethods] = useState<SavedRpcMethod[]>([]);
  const [expandedPayloadIndex, setExpandedPayloadIndex] = useState<{
    [key: number]: boolean;
  }>({});
  const [isNetworkChangeModalVisible, setIsNetworkChangeModalVisible] =
    useState(false);
  const [currentEndpointIndex, setCurrentEndpointIndex] = useState<
    number | undefined
  >();

  const [currentRequestTimestamp, setCurrentRequestTimestamp] = useState<
    number | undefined
  >();

  const [isCodeWrapped, setIsCodeWrapped] = useCodeWrappedSetting();

  const isRpcTab = saved.activeTab === "rpc";

  const updateSavedHorizonEndpoints = useCallback(() => {
    const horizonItems = localStorageSavedEndpointsHorizon
      .get()
      .filter((h) => h.network.id === network.id);
    setSavedEndpointsHorizon(horizonItems);
  }, [network.id]);

  const updateSavedRpcRequests = useCallback(() => {
    const rpcItems = localStorageSavedRpcMethods
      .get()
      .filter((r) => r.network.id === network.id);
    setSavedRpcMethods(rpcItems);
  }, [network.id]);

  useEffect(() => {
    updateSavedHorizonEndpoints();
  }, [updateSavedHorizonEndpoints]);

  useEffect(() => {
    updateSavedRpcRequests();
  }, [updateSavedRpcRequests]);

  useEffect(() => {
    const mappedRpcIndex = savedRpcMethods.reduce(
      (acc, _, index) => {
        acc[index] = false;
        return acc;
      },
      {} as { [key: number]: boolean },
    );

    setExpandedPayloadIndex(mappedRpcIndex);
  }, [savedRpcMethods]);

  const getNetworkConfig = (
    network: LocalStorageSavedNetwork,
  ): Network | undefined => {
    const defaults = getNetworkById(network.id);

    switch (network.id) {
      case "testnet":
      case "futurenet":
        return defaults;
      case "mainnet":
        return defaults
          ? { ...defaults, rpcUrl: network.rpcUrl || "" }
          : undefined;
      case "custom":
        return defaults
          ? {
              ...defaults,
              horizonUrl: network.horizonUrl || "",
              rpcUrl: network.rpcUrl || "",
              passphrase: network.passphrase || "",
            }
          : undefined;
      default:
        return undefined;
    }
  };

  const handleViewEndpoint = (
    endpoint: SavedEndpointHorizon,
    index: number,
  ) => {
    if (network.id !== endpoint.network.id) {
      setCurrentEndpointIndex(index);
      return setIsNetworkChangeModalVisible(true);
    }

    handleEndpointAction(endpoint);
  };

  const handleEndpointAction = (
    endpoint: SavedEndpointHorizon,
    isNetworkChange?: boolean,
  ) => {
    if (isNetworkChange) {
      const newNetwork = getNetworkConfig(endpoint.network);

      if (newNetwork) {
        updateIsDynamicNetworkSelect(true);
        selectNetwork(newNetwork);
      }
    }

    trackEvent(TrackingEvent.ENDPOINTS_SAVED_VIEW, {
      tab: saved.activeTab,
      route: endpoint.route,
    });

    setParams(endpoint.params);
    router.push(endpoint.route);
  };

  const HorizonEndpoints = () => {
    if (savedEndpointsHorizon.length === 0) {
      return `There are no saved Horizon Endpoints on ${network.label} network`;
    }

    return (
      <Box gap="md">
        {savedEndpointsHorizon.map((e, idx) => (
          <Box
            gap="sm"
            key={`horizon-${e.timestamp}`}
            addlClassName="PageBody__content"
            data-testid="saved-requests-horizon-item"
          >
            <Input
              id={`saved-horizon-${e.timestamp}`}
              data-testid="saved-horizon-name"
              fieldSize="md"
              value={e.name}
              readOnly
              placeholder="Click Edit to add Horizon Endpoint name"
              rightElement={
                <InputSideElement
                  variant="button"
                  placement="right"
                  onClick={() => {
                    setCurrentRequestTimestamp(e.timestamp);
                  }}
                  icon={<Icon.Edit05 />}
                  data-testid="saved-horizon-edit"
                />
              }
            />

            <div className="Endpoints__urlBar">
              <Input
                id={`endpoint-url-${e.timestamp}`}
                data-testid="saved-horizon-url"
                fieldSize="md"
                value={e.url}
                readOnly
                leftElement={
                  <InputSideElement
                    variant="text"
                    placement="left"
                    addlClassName="Endpoints__urlBar__requestMethod"
                  >
                    {e.method}
                  </InputSideElement>
                }
              />
            </div>

            <Box
              gap="lg"
              direction="row"
              align="center"
              justify="space-between"
              addlClassName="Endpoints__urlBar__footer"
            >
              <Box gap="sm" direction="row">
                <Button
                  size="md"
                  variant="tertiary"
                  type="button"
                  onClick={() => handleViewEndpoint(e, idx)}
                >
                  View
                </Button>

                <>
                  {e.shareableUrl ? (
                    <ShareUrlButton shareableUrl={e.shareableUrl} />
                  ) : null}
                </>
              </Box>

              <Box gap="sm" direction="row" align="center" justify="end">
                <Text
                  as="div"
                  size="xs"
                >{`Last saved ${formatTimestamp(e.timestamp)}`}</Text>

                <Button
                  size="md"
                  variant="error"
                  icon={<Icon.Trash01 />}
                  type="button"
                  onClick={() => {
                    const updatedList = arrayItem.delete(
                      savedEndpointsHorizon,
                      idx,
                    );

                    localStorageSavedEndpointsHorizon.set(updatedList);
                    setSavedEndpointsHorizon(updatedList);

                    trackEvent(TrackingEvent.ENDPOINTS_SAVED_DELETE, {
                      tab: saved.activeTab,
                    });
                  }}
                ></Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const RpcEndpoints = () => {
    if (savedRpcMethods.length === 0) {
      return `There are no saved RPC Methods ${network.label} network`;
    }

    return (
      <Box gap="md">
        {savedRpcMethods.map((e, idx) => (
          <Box
            gap="sm"
            key={`rpc-${e.timestamp}`}
            addlClassName="PageBody__content"
            data-testid="saved-requests-rpc-item"
          >
            <Box gap="sm" direction="row">
              <Badge size="md" variant="secondary">
                {e.rpcMethod}
              </Badge>
            </Box>

            <Input
              id={`saved-rpc-${e.timestamp}`}
              data-testid="saved-rpc-name"
              fieldSize="md"
              value={e.name}
              readOnly
              placeholder="Click Edit to add RPC Request name"
              rightElement={
                <InputSideElement
                  variant="button"
                  placement="right"
                  onClick={() => {
                    setCurrentRequestTimestamp(e.timestamp);
                  }}
                  icon={<Icon.Edit05 />}
                  data-testid="saved-rpc-edit"
                />
              }
            />

            <div className="Endpoints__urlBar">
              <Input
                id={`endpoint-url-${e.timestamp}`}
                data-testid="saved-rpc-url"
                fieldSize="md"
                value={e.url}
                readOnly
                leftElement={
                  <InputSideElement
                    variant="text"
                    placement="left"
                    addlClassName="Endpoints__urlBar__requestMethod"
                  >
                    {e.method}
                  </InputSideElement>
                }
              />
            </div>
            <Box
              gap="lg"
              direction="row"
              align="center"
              justify="space-between"
              addlClassName="Endpoints__urlBar__footer"
            >
              <Box gap="sm" direction="row" wrap="wrap">
                <Button
                  size="md"
                  variant="tertiary"
                  type="button"
                  onClick={() => handleViewEndpoint(e, idx)}
                >
                  View in API Explorer
                </Button>

                <>
                  <Button
                    size="md"
                    variant="tertiary"
                    type="button"
                    icon={
                      expandedPayloadIndex[idx] ? (
                        <Icon.ChevronDown />
                      ) : (
                        <Icon.ChevronRight />
                      )
                    }
                    onClick={() => {
                      const obj: { [key: number]: boolean } = {};

                      if (expandedPayloadIndex[idx]) {
                        obj[idx] = false;
                      } else {
                        obj[idx] = true;
                      }
                      setExpandedPayloadIndex({
                        ...expandedPayloadIndex,
                        ...obj,
                      });
                    }}
                  >
                    View payload
                  </Button>

                  <>
                    {e.shareableUrl ? (
                      <ShareUrlButton shareableUrl={e.shareableUrl} />
                    ) : null}
                  </>
                </>
              </Box>

              <Box gap="sm" direction="row" align="center" justify="end">
                <SavedItemTimestampAndDelete
                  timestamp={e.timestamp}
                  onDelete={() => {
                    const updatedList = arrayItem.delete(savedRpcMethods, idx);

                    localStorageSavedRpcMethods.set(updatedList);
                    setSavedRpcMethods(updatedList);
                  }}
                />
              </Box>
            </Box>
            {expandedPayloadIndex[idx] ? (
              <>
                <div
                  className="Endpoints__txTextarea"
                  data-testid="saved-rpc-payload"
                >
                  <PrettyJsonTextarea
                    json={e.payload}
                    label="Payload"
                    isCodeWrapped={isCodeWrapped}
                  />
                </div>
                <Box
                  gap="md"
                  direction="row"
                  justify="space-between"
                  align="center"
                >
                  <JsonCodeWrapToggle
                    isChecked={isCodeWrapped}
                    onChange={(isChecked) => {
                      setIsCodeWrapped(isChecked);
                    }}
                  />

                  <CopyJsonPayloadButton
                    jsonString={stringify(e.payload, null, 2) || ""}
                  />
                </Box>
              </>
            ) : (
              <></>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box gap="md" data-testid="saved-requests-container">
      <PageCard>
        <TabView
          heading={{ title: "Saved Requests" }}
          tab1={{
            id: "rpc",
            label: "RPC Methods",
            content: isRpcTab ? <RpcEndpoints /> : null,
          }}
          tab2={{
            id: "horizon",
            label: "Horizon Endpoints",
            content: !isRpcTab ? <HorizonEndpoints /> : null,
          }}
          activeTabId={saved.activeTab}
          onTabChange={(id) => {
            updateSavedActiveTab(id);

            trackEvent(TrackingEvent.ENDPOINTS_SAVED_TAB, {
              tab: saved.activeTab,
            });
          }}
        />
      </PageCard>

      <Alert
        variant="primary"
        title="Looking for your saved transactions?"
        placement="inline"
      >
        <NextLink href={Routes.SAVED_TRANSACTIONS} sds-variant="primary">
          See saved transactions
        </NextLink>
      </Alert>

      <Modal
        visible={
          isNetworkChangeModalVisible && currentEndpointIndex !== undefined
        }
        onClose={() => {
          setIsNetworkChangeModalVisible(false);
        }}
      >
        <Modal.Heading>Endpoint On Different Network</Modal.Heading>
        <Modal.Body>
          {`You are currently on ${network?.label} network. This endpoint is on ${savedEndpointsHorizon[currentEndpointIndex!]?.network?.label} network.`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              setIsNetworkChangeModalVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              const endpoint =
                currentEndpointIndex !== undefined &&
                savedEndpointsHorizon[currentEndpointIndex];

              if (endpoint) {
                handleEndpointAction(endpoint, true);
              }
            }}
          >
            Change network
          </Button>
        </Modal.Footer>
      </Modal>

      <SaveToLocalStorageModal
        type="editName"
        itemTitle={isRpcTab ? "RPC Method" : "Horizon Endpoint"}
        itemTimestamp={currentRequestTimestamp}
        allSavedItems={
          isRpcTab
            ? localStorageSavedRpcMethods.get()
            : localStorageSavedEndpointsHorizon.get()
        }
        isVisible={currentRequestTimestamp !== undefined}
        onClose={(isUpdate?: boolean) => {
          setCurrentRequestTimestamp(undefined);

          if (isUpdate) {
            if (isRpcTab) {
              updateSavedRpcRequests();
            } else {
              updateSavedHorizonEndpoints();
            }
          }
        }}
        onUpdate={(updatedItems) => {
          if (isRpcTab) {
            localStorageSavedRpcMethods.set(updatedItems as SavedRpcMethod[]);
          } else {
            localStorageSavedEndpointsHorizon.set(
              updatedItems as SavedEndpointHorizon[],
            );
          }

          trackEvent(TrackingEvent.ENDPOINTS_SAVED_EDIT, {
            tab: saved.activeTab,
          });
        }}
      />
    </Box>
  );
};
