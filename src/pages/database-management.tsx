import * as React from "react";
import { useState, useEffect } from "react";
import { db } from "../services/db";
import { FaSave } from "react-icons/fa";
import { IContext } from "../interfaces";
import { AppContext } from "../App";
import { Severity } from "../enums";
function DatabaseManagement() {
  const context = React.useContext<IContext>(AppContext);
  async function readFile(file: File) {
    try {
      await db.import(file, { overwriteValues: true, clearTablesBeforeImport: true }).then(() => {
        context.addToast(`Successfully imported database`, Severity.Success);
      });
    } catch (e) {
      context.addToast(`Error importing database: ${e}`, Severity.Error);
    }
  }
  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    var files: FileList = e.dataTransfer.files;
    readFile(files[0]);
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const saveData = (blob: Blob, filename: string) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display:none");
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  async function exportDatabase() {
    try {
      const blob = await db.export();
      saveData(blob, `lit-review-manager-db-${Date.now()}.json`);
      context.addToast(`Successfully exported database`, Severity.Success);
    } catch (e) {
      context.addToast(`Error exporting database: ${e}`, Severity.Error);
    }
  }

  return (
    <>
      <h1>Database Management</h1>

      <h2>Export</h2>
      <div className="row mb-4">
        <div className="col">
          <button className="btn btn-dark" onClick={() => exportDatabase()}>
            <FaSave />
            &nbsp;Export Database
          </button>
        </div>
      </div>

      <hr />
      <h2>Import</h2>
      <div className="row text-center">
        <div className="col">
          <div id="drop_zone" onDragOver={(e) => handleOnDragOver(e)} onDrop={(e) => handleOnDrop(e)}>
            <p>DROP CSV FILE&nbsp;HERE</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DatabaseManagement;
