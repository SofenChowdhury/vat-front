import { useEffect } from "react";

const KeyEvent = (key, cb, isCtrl) => {
  useEffect(() => {
    function handle(event) {
      if (
        !event.repeat &&
        event.key === key &&
        (!isCtrl || (isCtrl && event.ctrlKey))
      ) {
        cb(event);
      }
    }

    document.addEventListener("keydown", handle);

    return () => {
      document.removeEventListener("keydown", handle);
    };
  }, [key, isCtrl, cb]);
};

export default KeyEvent;
