import moment from "moment";
import { useStores } from "../../models";
import React, { useEffect, useRef, useState } from "react"
import { Grid } from "@mui/material"
import MDTypography from "../MDTypography"

export const useLoginStore = () => {
  const rootStore = useStores();
  return rootStore.loginStore;
};

export const snapTime = (time, forward) => {
  const start = moment(time);
  if (forward) {
    const remainder = 30 - (start.minute() % 30);

    return start.add(remainder, "minutes");
  } else {
    const remainder = start.minute() % 30;

    return start.subtract(remainder, "minutes");
  }
};

export const getTimeSlot = (time) => {
  return [snapTime(time, false), snapTime(time, true)];
};

const getOrientation = () => {
  try {
    return window.screen.orientation.type;
  }catch (e) {
    try {
      return window.orientation === 0 ? "portrait-primary" : "landscape-primary";
    }catch (e) {
      return "landscape-primary";
    }
  }
}

export const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState(getOrientation());

  const updateOrientation = (event) => {
    setOrientation(getOrientation());
  };

  useEffect(() => {
    window.addEventListener("orientationchange", updateOrientation);
    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};

export const MODALITY_OPTIONS = {
  VIRTUAL: 1,
  IN_PERSON: 2,
  HYBRID: 3,
  _LABELS: {
    1: "Virtual",
    2: "In Person",
    3: "Hybrid",
  },
};

export const ENROLMENT_STATUS = {
  INVITED: 1,
  REQUESTED: 2,
  ACCEPTED: 3,
  REJECTED: 4,
  WITHDRAWN: 5,
  _LABELS: {
    1: "Invited",
    2: "Requested",
    3: "Accepted",
    4: "Rejected",
    5: "Withdrawn",
  },
};

export const CREATE_COURSE_STEPS = {
  STEP_1: 0,
  STEP_2: 1,
  STEP_3: 2,
};

export const TYPE_OF_QUESTIONNAIRE_OPTIONS = {
  OPEN: 1,
  MULTIPLE_CHOICE: 2,
  _LABELS: {
    1: "Open Ended",
    2: "Multiple Choice",
  },
};

export const TYPE_OF_INTERACTION_OPTIONS = {
  DPAD: 1,
  BUTTONS: 2,
  BOTH: 3,
  _LABELS: {
    1: "D-Pad",
    2: "Buttons",
    3: "Both",
  },
};

export const BUTTON_TYPE = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  A: 5,
  B: 6,
  X: 7,
  Y: 8,
  _LABELS: {
    1: "Up",
    2: "Down",
    3: "Left",
    4: "Right",
    5: "A",
    6: "B",
    7: "X",
    8: "Y",
  },
};

export const TYPE_OF_QUESTION_ABOUT = {
  REFLECTION: 1,
  SEWB: 2,
  _LABELS: {
    1: "Reflection",
    2: "SEWB",
  },
};

export const TYPE_OF_MOMENT_POPUP = {
  CHECK_IN: 1,
  EXIT_TICKET: 2,
  _LABELS: {
    1: "Check-in",
    2: "Exit ticket",
  },
};

export const FROM_USER = {
  ADMIN: "(Admin)",
  USER: "(You)",
};

export const TRANSACTION_TYPE = {
  DEDUCTION: 1,
  ADDITION: 2,
  PURCHASE: 3,
  REFUND: 4,
  _LABELS: {
    1: "Deduction",
    2: "Addition",
    3: "Purchase",
    4: "Refund",
  },
};

export function mapValue(value, min, max, mino, maxo) {
  return mino + (maxo - mino) * ((value - min) / (max - min));
}

export const changeState = (setStateFunc, key, value) => {
  setTimeout(() => {
    setStateFunc(prevState => ({ ...prevState, [key]: value }));
  }, 200);
};






