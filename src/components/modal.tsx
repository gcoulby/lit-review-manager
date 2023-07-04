import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import { IContext } from "../interfaces";
import { FaTimes } from "react-icons/fa";
function CommentsModal() {
  const context = React.useContext<IContext>(AppContext);
  const [content, setContent] = useState<string>(context.modalContent?.content as string);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setContent(context.modalContent?.content as string);
    contentRef.current?.focus();
  }, [context.modalContent?.content]);
  return (
    <>
      {context.showModal && (
        <div className="modal modal-sheet position-static d-block bg-body-secondary p-4 py-md-5" role="dialog" id="modalSheet">
          <div className="overlay" onClick={() => context.setShowModal(false)}></div>
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-bottom-0">
                <h1 className="modal-title fs-6">{context.modalContent?.title}</h1>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => context.setShowModal(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body py-0">
                <div className="row">
                  <div className="col">
                    <h2 className="fs-6">Comments</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <textarea
                      ref={contentRef}
                      rows={8}
                      className="form-control"
                      value={content}
                      disabled={!context.modalContent?.editable}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    context.modalContent?.onSave(context.modalContent?.articleId, content);
                    if (context.modalContent?.editable) {
                      setContent("");
                    }
                    context.setShowModal(false);
                  }}
                >
                  {context.modalContent?.editable && "Save and"} Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentsModal;
