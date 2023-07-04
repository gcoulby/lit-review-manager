import * as React from "react";
import { useContext } from "react";
import { AppContext } from "../App";
import { BiErrorAlt, BiError, BiMessageRoundedError, BiCheckCircle } from "react-icons/bi";
import { IContext } from "../interfaces";
import { Severity } from "../enums";
function Toasts() {
  const context = useContext<IContext>(AppContext);
  const getIcon = (severity: Severity) => {
    switch (severity) {
      case Severity.Error:
        return <BiErrorAlt />;
      case Severity.Warning:
        return <BiError />;
      case Severity.Info:
        return <BiMessageRoundedError />;
      case Severity.Success:
        return <BiCheckCircle />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sticky-top bd-example-toast mt-4 rounded-3">
        <div className="toast-container top-0 end-0" id="toastPlacement">
          {context.toasts.map((toast) => (
            <div key={`toast_${toast.id}`} className={`toast fade show bg-light`}>
              <div className={`toast-body d-flex`}>
                <span className={`toast-icon me-3 bg-${toast.severity} px-2 h-100 text-${toast.severity === Severity.Warning ? "dark" : "light"}`}>
                  {getIcon(toast.severity)}
                </span>
                <span className="me-auto">{toast.message}</span>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  onClick={() => context.removeToast(toast.id)}
                ></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Toasts;
