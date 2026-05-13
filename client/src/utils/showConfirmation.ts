import Notiflix from "notiflix";

// Reusable confirmation function
export const showConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Notiflix.Confirm.show(
    title,
    message,
    "Confirm",
    "Cancel",
    onConfirm,
    onCancel || (() => console.log("Canceled")),
    {
      borderRadius: "8px",
      titleColor: "#d33",
      okButtonBackground: "#d33",
      okButtonColor: "#fff",
    }
  );
};
