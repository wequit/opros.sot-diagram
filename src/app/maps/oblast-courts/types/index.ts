export interface CourtData {
  id: number;
  name: string;
  instance: string;
  building_rating: number;
  overall_assessment: number;
  judge_rating: number;
  process_rating: number;
  staff_rating: number;
  office_rating: number;
  accessibility_rating: number;
  total_responses: number;
}

export interface MapProps {
  selectedCourt: string | null;
  courtData: CourtData[];
  onSelectCourt: (courtName: string) => void;
} 