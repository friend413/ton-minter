import { Typography } from "@mui/material";
import BigNumberDisplay from "components/BigNumberDisplay";
import { Popup } from "components/Popup";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { toDecimalsBN } from "utils";
import { AppButton } from "components/appButton";
import { AppNumberInput } from "components/appInput";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useSnackbar } from "notistack";
import { IconButton, styled } from "@mui/material";
import { Box } from "@mui/system";
const StyledMessage = styled(Box)({
  "& &": {
    color: "white",
  },
  "& a": {
    color: "white",
  },
});


function MintJettonsAction() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [tonconnect] = useTonConnectUI();
  const { jettonMaster, isAdmin, symbol, getJettonDetails, isMyWallet, decimals, totalSupply } =
    useJettonStore();
  const walletAddress = useTonAddress();
  const { showNotification } = useNotification();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onMint = async () => {
    console.log(amount);
    
    if (!jettonMaster) {
      return;
    }

    if (!amount || amount === 0) {
      showNotification(`Minimum amount of ${symbol} to mint is 1`, "warning");
      return;
    }

    console.log(amount);
    
    if (toDecimalsBN(amount, 9).add(totalSupply || toDecimalsBN(0, 9)) > toDecimalsBN(100000000, 9)) {
      showNotification(`Maximum amount of ${symbol} to mint is 100000000`, "warning");
      return;
    }
    const value = toDecimalsBN(amount, decimals!);


    try {
      await jettonDeployController.mint(
        tonconnect,
        Address.parse(jettonMaster),
        value,
        walletAddress,
      );
      setOpen(false);
      const message = (
        <>
          Successfully minted <BigNumberDisplay value={amount} /> {symbol}
        </>
      );
      getJettonDetails();
      showNotification(message, "success");
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
      setOpen(false);
    }
  };

  const onClose = () => {
    console.log(amount);
    
    setAmount(0);
    setOpen(false);
  };

  return (
    <>
      <Popup open={open && !actionInProgress} onClose={onClose} maxWidth={400}>
        <>
          <Typography className="title">Mint {symbol}</Typography>
          <AppNumberInput
            label={`Enter ${symbol} amount`}
            value={amount}
            onChange={(value: number) => setAmount(value)}
          />
          <AppButton onClick={onMint}>Submit</AppButton>
        </>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={() => setOpen(true)}>
        Mint
      </AppButton>
    </>
  );
}

export default MintJettonsAction;
