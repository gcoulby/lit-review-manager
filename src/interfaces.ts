import { ReactElement } from "react";
import { Severity } from "./enums";

export interface IContext {
  toasts: IToast[];
  addToast: (message: string, severity: Severity) => void;
  removeToast: (id: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalContent: IModalContent | null;
  setModalContent: (content: IModalContent | null) => void;
  // showCommentsModal: boolean;
  // setShowCommentsModal: (show: boolean) => void;
  // commentsModalContent: ICommentsModalContent | null;
  // setCommentsModalContent: (content: ICommentsModalContent | null) => void;
}

export interface IProfile {
  name: string;
  hasHeaders: boolean;
  filterColumn: string;
  selectedFilterColumnValues: string[];
  selectedHeaders: string[];
}

export interface IArticle {
  id: string;
  include: boolean;
  authors: string[];
  author_short: string;
  title: string;
  year: number;
  doi: string;
  link: string;
  abstract: string;
  gpt_response: string;
}

export interface IAuthor {
  id: string;
  name: string;
}

export interface IPage {
  url: string;
  pageName: string;
  icon: ReactElement;
  active: boolean;
}

export interface IReview {
  id: string;
  title: string;
  gpt_prompt: string;
  articles: IArticle[];
}

export interface IToast {
  id: string;
  message: string;
  severity: Severity;
}

export interface IHeaderIndex {
  [key: string]: number;
}

export interface IModalContent {
  title: string;
  content: string;
  editable: boolean;
  articleId: string;
  onSave: (id: string, content: string) => void;
}
