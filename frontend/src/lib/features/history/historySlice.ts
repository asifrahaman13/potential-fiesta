import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Summary {
  summary: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface HistoryState {
  summary: Summary;
  details: string[];
}

interface SetBasicDataPayload {
  summary: Summary;
}

interface SetTranscriptionsPayload {
  details: string[];
}

interface ChangeTranscriptPayload {
  index: number;
  newTranscript: string;
}

interface ChangeSummaryFieldsPayload {
  fieldName: keyof Summary;
  summary: string;
}

const initialState: HistoryState = {
  summary: {
    summary: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  },
  details: [''],
};

export const historySlice = createSlice({
  name: 'History slice',
  initialState,
  reducers: {
    setBasicData: (state, action: PayloadAction<SetBasicDataPayload>) => {
      const { summary } = action.payload;
      state.summary = summary;
    },
    setTranscriptions: (
      state,
      action: PayloadAction<SetTranscriptionsPayload>
    ) => {
      const { details } = action.payload;
      state.details = details;
    },
    changeTranscript: (
      state,
      action: PayloadAction<ChangeTranscriptPayload>
    ) => {
      const { index, newTranscript } = action.payload;
      state.details = [
        ...state.details.slice(0, index),
        newTranscript,
        ...state.details.slice(index + 1),
      ];
    },
    changeSummaryFields: (
      state,
      action: PayloadAction<ChangeSummaryFieldsPayload>
    ) => {
      const { fieldName, summary } = action.payload;
      state.summary[fieldName] = summary;
    },
  },
});

export const {
  setBasicData,
  changeTranscript,
  changeSummaryFields,
  setTranscriptions,
} = historySlice.actions;

export default historySlice.reducer;
