export type Composer = {
  id: number;
  name: string | null;
  status: number; 
  deleted: boolean;
  portraitUrl: string | null;
  biography: string | null;
  
  analyzedWorks: number | null;
  totalIntervals: number | null;
  period: string | null;
  polyphonyType: string | null;

  unisonsSecondsFreq: number | null;
  unisonsSecondsStddev: number | null;

  thirdsFreq: number | null;
  thirdsStddev: number | null;

  fourthsFifthsFreq: number | null;
  fourthsFifthsStddev: number | null;

  sixthsSeventhsFreq: number | null;
  sixthsSeventhsStddev: number | null;

  octavesFreq: number | null;
  octavesStddev: number | null;
};

export type Analysis = {
  id: number;
  composers: Composer[];
  createdAt: Date;
};  