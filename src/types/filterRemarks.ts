// filterRemarks.ts
import { Remark } from '@/components/RemarksApi'; // Проверьте корректность пути

export const filterRemarks = (
  remarks: Remark[],
  user: any,
  pathname: string,
  selectedCourtName: string | null
): Remark[] => {
  return remarks.filter((item: Remark) => {
    if (user.role === "Председатель 3 инстанции" && pathname === "/") {
      return item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос";
    }

    if (user.role === "Председатель 3 инстанции") {
      if (pathname === "/maps/General") {
        return (
          item.court === "Верховный суд" &&
          item.custom_answer !== null &&
          item.custom_answer !== "Необязательный вопрос"
        );
      } else if (pathname === "/maps/oblast/Regional-Courts") {
        if (item.court === selectedCourtName) {
          return (
            item.custom_answer !== null &&
            item.custom_answer !== "Необязательный вопрос"
          );
        } else {
          return false;
        }
      }
    }

    if (user.role === "Председатель 2 инстанции" && selectedCourtName && selectedCourtName === item.court) {
      return item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос";
    }

    if (user.role === "Председатель 2 инстанции") {
      return false;
    }

    // Default condition:
    return item.custom_answer !== null && item.custom_answer !== "Необязательный вопрос";
  });
};
