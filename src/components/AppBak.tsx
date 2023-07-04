import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import { IArticle, IProfile } from "../interfaces";
import { v4 } from "uuid";
import { FaExternalLinkAlt } from "react-icons/fa";
import Nav from "./nav";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function AppBak() {
  const [articles, setArticles] = useState<IArticle[]>([]);

  const [alertLevel, setAlertLevel] = useState<string>("secondary");
  const [loadedStatus, setLoadedStatus] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("Drag a file into the box below to begin");
  const [hasHeaders, setHasHeaders] = useState<boolean>(true);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeaders, _setSelectedHeaders] = useState<string[]>([]);
  const [profileName, setProfileName] = useState<string>("");

  const [rows, setRows] = useState<string[]>([]);
  const [filterColumn, setFilterColumn] = useState<string>("");
  const [filterColumnValues, setFilterColumnValues] = useState<string[]>([]);
  const [selectedFilterColumnValues, _setSelectedFilterColumnValues] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [profiles, _setProfiles] = useState<IProfile[]>([
    // {
    //   name: "profile1",
    //   hasHeaders: true,
    //   filterColumn: "department",
    //   selectedFilterColumnValues: ["Defence", "Management"],
    //   selectedHeaders: ["firstName", "lastName", "department"],
    // },
  ]);

  const setProfiles = (profiles: IProfile[]) => {
    localStorage.setItem("csv-filter-profiles", JSON.stringify(profiles));
    _setProfiles(profiles);
  };

  const setSelectedHeaders = (e: ChangeEvent<HTMLSelectElement>) => {
    const options: HTMLCollectionOf<HTMLOptionElement> = e.target.selectedOptions;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    _setSelectedHeaders(selected);
  };

  const setHeadersFromRows = () => {
    if (rows.length === 0) return;
    if (!hasHeaders) {
      const headers: string[] = [];
      for (let i: number = 0; i < rows[0].split(",").length; i++) {
        headers.push(`Column ${i + 1}`);
      }
      setHeaders(headers);
      return;
    }
    const headers: string[] = rows[0].split(",");
    //trimmed headers
    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].trim();
    }
    setHeaders(headers);
  };

  const setFilterColumnValuesFromRows = (filter: string | undefined) => {
    filter = filter ?? filterColumn;
    if (rows.length === 0) return;
    const filterColumnValues: string[] = [];
    const filterColumnIndex: number = headers.indexOf(filter);
    for (let i: number = 1; i < rows.length; i++) {
      const rowSplit: string[] = rows[i].split(",");
      const value: string = rowSplit[filterColumnIndex]?.trim();
      if (!filterColumnValues.includes(value)) {
        filterColumnValues.push(value);
      }
    }
    setFilterColumnValues(filterColumnValues);
  };

  const setSelectedFilterColumnValues = (e: ChangeEvent<HTMLSelectElement>) => {
    const options: HTMLCollectionOf<HTMLOptionElement> = e.target.selectedOptions;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    _setSelectedFilterColumnValues(selected);
  };

  const loadProfile = () => {
    const profile: IProfile = profiles[0];
    setHasHeaders(profile.hasHeaders);
    setFilterColumn(profile.filterColumn);
    _setSelectedHeaders(profile.selectedHeaders);
  };

  const saveProfile = (profName: string | undefined) => {
    profName = profName ?? profileName;
    if (profName === "") return;
    const profile: IProfile = {
      name: profileName,
      hasHeaders: hasHeaders,
      filterColumn: filterColumn,
      selectedFilterColumnValues: selectedFilterColumnValues,
      selectedHeaders: selectedHeaders,
    };
    if (profiles.findIndex((p) => p.name === profName) !== -1) {
      const newProfiles: IProfile[] = [...profiles];
      newProfiles[profiles.findIndex((p) => p.name === profName)] = profile;
      setProfiles(newProfiles);
      return;
    } else {
      const newProfiles: IProfile[] = [...profiles];
      newProfiles.push(profile);
      setProfiles(newProfiles);
    }
    setSelectedProfile(profileName);
  };

  const deleteProfile = (profName: string | undefined) => {
    profName = profName ?? profileName;
    if (profName === "") return;
    const newProfiles: IProfile[] = [...profiles];
    newProfiles.splice(
      profiles.findIndex((p) => p.name === profName),
      1
    );
    setProfiles(newProfiles);
  };

  const readFile = (file: File) => {
    // var reader: FileReader = new FileReader();
    // reader.onload = function (e: ProgressEvent<FileReader>) {
    //   var contents = e.target?.result;
    //   if (typeof contents !== "string") return;
    //   setStatus(`Parsing data from ${file.name}`);
    //   setAlertLevel("info");
    //   setLoadedStatus(true);
    //   contents = contents.replace(/\r/g, "");
    //   const rows = contents.split("\n");
    //   const articles: IArticle[] = [];
    //   rows.map((row: string, index: number) => {
    //     if (index === 0) return;
    //     const rowSplit: string[] = row.split('","');
    //     let authors = rowSplit[0].split(";").map((author) => {
    //       return author.trim().replace('"', "");
    //     });
    //     let author_short = authors.length > 1 ? authors[0].split(" ")[0] + " et al." : authors[0];
    //     articles.push({
    //       id: v4(),
    //       authors: authors,
    //       author_short: author_short,
    //       title: rowSplit[3],
    //       year: parseInt(rowSplit[4]),
    //       doi: rowSplit[5],
    //       link: rowSplit[6],
    //     });
    //   });
    //   setArticles(articles);
    //   console.log(articles);
    //   setRows(rows);
    // };
    // reader.readAsText(file);
  };

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    var files: FileList = e.dataTransfer.files;
    readFile(files[0]);
    setLoadedStatus(true);
    setStatus(`Parsing data from ${files[0]?.name}`);
    setAlertLevel("info");
  };

  const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
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

  const exportFile = () => {
    const newRows: string[] = [];
    const headerIndices: number[] = [];
    //get indices of selected headers

    for (let i: number = 0; i < selectedHeaders.length; i++) {
      headerIndices.push(headers.indexOf(selectedHeaders[i]));
    }
    const filterColumnIndex = headers.indexOf(filterColumn);

    newRows.splice(0, 1);

    if (!hasHeaders) {
      const newHeaderRow: string[] = [];
      for (let i: number = 0; i < headerIndices.length; i++) {
        newHeaderRow.push(headers[headerIndices[i]]);
      }
      newRows.push(newHeaderRow.join(","));
    }

    for (let i: number = 0; i < rows.length; i++) {
      const rowSplit: string[] = rows[i].split(",");
      const newRow: string[] = [];
      var keepRow: boolean = true;

      for (let j: number = 0; j < headerIndices.length; j++) {
        const val = rowSplit[headerIndices[j]].trim();
        if (i > 0 && headerIndices[j] === filterColumnIndex && !selectedFilterColumnValues.includes(val)) {
          keepRow = false;
          break;
        }
        newRow.push(val);
      }
      if (keepRow) {
        newRows.push(newRow.join(","));
      }
    }
    const blob = new Blob([newRows.join("\n")], { type: "text/csv" });
    saveData(blob, "filtered.csv");
  };

  useEffect(() => {
    setHeadersFromRows();
  }, [hasHeaders, rows]);

  useEffect(() => {
    setFilterColumnValuesFromRows(undefined);
  }, [headers, filterColumn]);

  useEffect(() => {
    _setSelectedFilterColumnValues(profiles[profiles.findIndex((p) => p.name === selectedProfile)]?.selectedFilterColumnValues);
  }, [filterColumnValues]);

  useEffect(() => {
    if (selectedProfile === "") return;
    loadProfile();
  }, [selectedProfile]);

  useEffect(() => {
    setProfiles(JSON.parse(localStorage.getItem("csv-filter-profiles") || "[]"));
  }, []);

  return (
    <div className="App mb-4">
      {/* <Nav />
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1 className="display-1">Lit Review Manager</h1>
          </div>
        </div>
      </div>
      <div className="container text-center">
        <hr />
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h5>Data Privacy Statement</h5>
            <p>
              This app works client-side (processed by your browser) and no data is collected, stored or managed by this application. When the Save
              File(s) button is clicked a file is generated locally in your browser and will automatically download to your machine as a compressed
              archive.
            </p>
          </div>
          <hr />
        </div>
      </div>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <p className={`alert alert-${alertLevel}`} id="file_name">
              <strong>{loadedStatus ? "" : "No "}File Loaded</strong> {status}
            </p>
            {loadedStatus ? (
              <></>
            ) : (
              <div id="drop_zone" onDragOver={(e) => handleOnDragOver(e)} onDrop={(e) => handleOnDrop(e)}>
                <p>DROP CSV FILE&nbsp;HERE</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-4">
          <div className="col">
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h3>Data</h3>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Author</th>
                  <th scope="col">Title</th>
                  <th scope="col">year</th>
                  <th scope="col">DOI</th>
                  <th scope="col">Link</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr>
                    <td>{article.author_short}</td>
                    <td>{article.title}</td>
                    <td>{article.year}</td>
                    <td>{article.doi}</td>
                    <td>
                      <a href={article.link} rel="noopener noreferrer" target="_blank">
                        <FaExternalLinkAlt />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <button className="btn btn-primary" onClick={() => exportFile()}>
              Export CSV File
            </button>
            <button className="btn btn-secondary mx-4" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default AppBak;
