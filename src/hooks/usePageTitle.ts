import { useEffect } from "react";

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} | Prescribto` : "Prescribto — Your Digital Prescription Companion";
  }, [title]);
};

export default usePageTitle;
