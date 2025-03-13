"use client";

import { useSurveyData } from "@/context/SurveyContext";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import Breadcrumb from "@/lib/utils/breadcrumb/BreadCrumb";
import * as d3 from "d3";
import { GeoPermissibleObjects } from "d3-geo";
import geoData from "../../../../../../public/gadm41_KGZ_1.json";
import districtsGeoData from "../../../../../../public/gadm41_KGZ_2.json";
import { FaSort, FaSortUp, FaSortDown, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

const getRatingColor = (rating: number) => {
  if (rating === 0) return "bg-gray-100";
  if (rating < 2) return "bg-red-100";
  if (rating < 2.5) return "bg-red-100";
  if (rating < 3) return "bg-orange-100";
  if (rating < 3.5) return "bg-yellow-100";
  if (rating < 4) return "bg-emerald-100";
  return "bg-green-100";
};

interface RegionData {
  id: number;
  name: string;
  ratings: number[];
  overall: number;
  totalAssessments: number;
  coordinates?: [number, number];
  instance?: string;
  assessment?: {
    judge: number;
    process: number;
    staff: number;
    office: number;
    building: number;
  };
}

interface GeoFeature {
  type: string;
  properties: {
    GID_1: string;
    GID_0: string;
    COUNTRY: string;
    NAME_1: string;
    VARNAME_1: string;
    NL_NAME_1: string;
    TYPE_1: string;
    ENGTYPE_1: string;
    CC_1: string;
    HASC_1: string;
    ISO_1: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
}

interface GeoJsonData {
  type: string;
  name: string;
  crs: { type: string; properties: { name: string } };
  features: GeoFeature[];
}

const courtPositionsMap: { [key: string]: { [key: string]: [number, number] } } = {
  // ... (оставляем без изменений)
};

type SortField = "overall" | "judge" | "staff" | "process" | "office" | "building" | "count" | "name" | null;
type SortDirection = "asc" | "desc" | null;

function getEventCoordinates(event: any) {
  if (event.touches && event.touches[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  return { x: event.clientX, y: event.clientY };
}

const districtNamesRu: { [key: string]: string } = {
  // ... (оставляем без изменений)
};

const getDisplayName = (name: string): string => {
  return name
    .replace(" районный суд", " район")
    .replace(" городской суд", " город")
    .replace(" межрайонный суд", " район");
};

const getRegionColor = (rating: number, properties?: any): string => {
  if (properties && isLake(properties)) return "#7CC9F0";
  if (rating === 0) return "#E5E7EB";
  if (rating < 2) return "#FEE2E2";
  if (rating < 2.5) return "#FEE2E2";
  if (rating < 3) return "#FFEDD5";
  if (rating < 3.5) return "#FEF9C3";
  if (rating < 4) return "#DCFCE7";
  return "#BBF7D0";
};

interface RegionDetailsProps {
  regionName: string | null;
  regions: RegionData[];
}

function isLake(properties: any): boolean {
  return (
    properties.NAME_2 === "Ysyk-Köl(lake)" ||
    properties.NAME_2 === "Ysyk-Kol" ||
    properties.NAME_2 === "Issyk-Kul" ||
    properties.NAME_2 === "Song-Kol" ||
    properties.NAME_2 === "Song-Kol(lake)" ||
    properties.NAME_2 === "Song-kol"
  );
}

const RegionDetails: React.FC<RegionDetailsProps> = ({ regionName, regions }) => {
  const {
    selectedRegion,
    setSelectedRegion,
    setSelectedCourtName,
    setSelectedCourtId,
    setRegionName,
  } = useSurveyData();

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (regionName) {
      setRegionName(regionName);
      localStorage.setItem("regionName", regionName); 
    }
  }, [regionName, setRegionName]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
      if (sortDirection === "desc") setSortField(null);
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="ml-1 inline-block" />;
    if (sortDirection === "asc") return <FaSortUp className="ml-1 inline-block text-blue-600" />;
    return <FaSortDown className="ml-1 inline-block text-blue-600" />;
  };

  const sortedCourts = useMemo(() => {
    if (!selectedRegion) return [];
    return [...selectedRegion].sort((a, b) => {
      if (!sortField || !sortDirection) return 0;
      let aValue: number, bValue: number;
      switch (sortField) {
        case "judge": aValue = a.ratings[0]; bValue = b.ratings[0]; break;
        case "staff": aValue = a.ratings[1]; bValue = b.ratings[1]; break;
        case "process": aValue = a.ratings[2]; bValue = b.ratings[2]; break;
        case "office": aValue = a.ratings[3]; bValue = b.ratings[3]; break;
        case "building": aValue = a.ratings[4]; bValue = b.ratings[4]; break;
        case "count": aValue = a.totalAssessments; bValue = b.totalAssessments; break;
        case "overall": aValue = a.overall; bValue = b.overall; break;
        case "name":
          aValue = a.name.localeCompare(b.name, "ru", { sensitivity: "base" });
          bValue = b.name.localeCompare(a.name, "ru", { sensitivity: "base" });
          break;
        default: return 0;
      }
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [selectedRegion, sortField, sortDirection]);

  const filteredCourts = useMemo(() => {
    if (!searchQuery.trim()) return sortedCourts;
    return sortedCourts.filter((court) =>
      court.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sortedCourts]);

  const handleCourtClick = (courtId: number, courtName: string) => {
    setSelectedCourtId(courtId);
    setSelectedCourtName(courtName);
    localStorage.setItem("selectedCourtId", courtId.toString());
    localStorage.setItem("selectedCourtName", courtName);
    router.push(`/Home/second-instance/${courtId}/ratings`); // Изменено на "rating" согласно вашему запросу
  };

  const handleRegionBackClick = () => {
    setSelectedRegion(null);
    setSelectedCourtId(null);
    setSelectedCourtName(null);
    setRegionName(null);
    router.push("/Home/second-instance/regions");
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedRegion) {
        setSelectedRegion(null);
        setSelectedCourtId(null);
        setSelectedCourtName(null);
        setRegionName(null);
      }
      event.preventDefault();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedRegion, setSelectedRegion, setSelectedCourtId, setSelectedCourtName, setRegionName]);

  const renderRegionMap = useCallback(() => {
    if (!regionName || !selectedRegion) return null;

    const isBishkek = regionName === "Город Бишкек";
    const courtPositions = courtPositionsMap[regionName] || {};
    const regionMapping: { [key: string]: string } = {
      "Баткенская область": "Batken",
      "Жалал-Абадская область": "Jalal-Abad",
      "Иссык-Кульская область": "Ysyk-Köl",
      "Нарынская область": "Naryn",
      "Ошская область": "Osh",
      "Таласская область": "Talas",
      "Чуйская область": "Chüy",
      "Город Бишкек": "Biškek",
    };

    const geoJsonData = geoData as GeoJsonData;
    const regionFeature = geoJsonData.features.find(
      (feature) => feature.properties.NAME_1 === regionMapping[regionName]
    );
    if (!regionFeature) return null;

    const districtFeatures = (districtsGeoData as any).features.filter(
      (feature: any) => feature.properties.NAME_1 === regionMapping[regionName]
    );

    return (
      <div className="w-full h-[400px] relative mb-6 bg-white rounded-lg shadow-sm p-4 RegionDetailsMap">
        <style>{`
          #tooltip {
            pointer-events: none;
            transition: all 0.1s ease;
            z-index: 1000;
            position: fixed;
          }
        `}</style>
        <div id="tooltip" className="absolute hidden bg-white px-3 py-2 rounded shadow-lg border border-gray-200 z-50" />
        <svg
          ref={(node) => {
            if (node) {
              const width = node.clientWidth;
              const height = node.clientHeight;
              const svg = d3.select(node);
              svg.selectAll("*").remove();

              const margin = { top: 20, right: 20, bottom: 20, left: 20 };
              const innerWidth = width - margin.left - margin.right;
              const innerHeight = height - margin.top - margin.bottom;

              const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
              const projection = d3.geoMercator().fitSize([innerWidth, innerHeight], regionFeature as unknown as GeoPermissibleObjects);
              const path = d3.geoPath().projection(projection);

              g.append("path")
                .datum(regionFeature as unknown as GeoPermissibleObjects)
                .attr("d", path)
                .attr("fill", () => {
                  const regionData = regions.find((r: RegionData) => r.name === regionName);
                  return getRegionColor(regionData?.overall || 0);
                })
                .attr("stroke", "#4B5563")
                .attr("stroke-width", 0.8)
                .attr("stroke-opacity", 0.5);

              svg.on("mouseleave", () => d3.select("#tooltip").style("display", "none"));

              if (!isBishkek) {
                g.selectAll("path.district-border")
                  .data(districtFeatures)
                  .enter()
                  .append("path")
                  .attr("class", "district-border")
                  .attr("d", path as any)
                  .attr("fill", (d: any) => {
                    if (isLake(d.properties)) return "#7CC9F0";
                    const courtName = districtNamesRu[d.properties.NAME_2];
                    const court = selectedRegion?.find((c) => c.name === courtName);
                    return getRegionColor(court?.overall || 0);
                  })
                  .attr("stroke", "#4B5563")
                  .attr("stroke-width", 1)
                  .attr("pointer-events", "all")
                  .on("mouseover", function (event, d: any) {
                    if (isLake(d.properties)) return;
                    d3.select(this).attr("stroke-width", "1.5");
                    const tooltip = d3.select("#tooltip");
                    const coordinates = getEventCoordinates(event);
                    const districtName = d.properties.NAME_2;
                    const russianName = districtNamesRu[districtName] || districtName;
                    const displayName = getDisplayName(russianName);
                    const court = selectedRegion?.find((c) => c.name === russianName);
                    const rating = court?.overall || 0;

                    tooltip
                      .style("display", "block")
                      .style("left", `${coordinates.x + 10}px`)
                      .style("top", `${coordinates.y + 10}px`)
                      .html(`
                        <div class="font-medium">${displayName}</div>
                        <div class="text-sm text-gray-600">Общая оценка: ${rating ? rating.toFixed(1) : "Нет данных"}</div>
                      `);
                  })
                  .on("mousemove", function (event) {
                    const coordinates = getEventCoordinates(event);
                    d3.select("#tooltip").style("left", `${coordinates.x}px`).style("top", `${coordinates.y}px`);
                  })
                  .on("mouseout", function () {
                    d3.select(this).attr("fill-opacity", 1);
                    d3.select("#tooltip").style("display", "none");
                  });

                const textGroup = g.append("g").attr("class", "rating-labels");
                textGroup
                  .selectAll("text")
                  .data(districtFeatures)
                  .join("text")
                  .attr("x", (d: any) => path.centroid(d)[0])
                  .attr("y", (d: any) => path.centroid(d)[1])
                  .attr("text-anchor", "middle")
                  .style("pointer-events", "none")
                  .attr("font-weight", "bold")
                  .attr("font-size", "10px")
                  .text((d: any) => {
                    if (isLake(d.properties)) return "";
                    const courtName = districtNamesRu[d.properties.NAME_2];
                    const court = selectedRegion?.find((c) => c.name === courtName);
                    return court?.overall ? court.overall.toFixed(1) : "0.0";
                  });
              }

              selectedRegion.forEach((court: RegionData & { coordinates?: [number, number] }) => {
                const position = courtPositions[court.name];
                if (position) {
                  const [lon, lat] = position;
                  const [x, y] = projection([lon, lat]) || [0, 0];
                  g.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 6)
                    .attr("fill", getRegionColor(court.overall))
                    .attr("stroke", "#4B5563")
                    .attr("stroke-width", 1.5)
                    .attr("class", "cursor-pointer transition-all duration-200")
                    .attr("filter", "drop-shadow(0 1px 1px rgb(0 0 0 / 0.1))")
                    .on("mouseover", (event) => {
                      const coordinates = getEventCoordinates(event);
                      const tooltip = d3.select("#tooltip");
                      tooltip
                        .style("display", "block")
                        .style("left", `${coordinates.x}px`)
                        .style("top", `${coordinates.y}px`)
                        .html(`
                          <div class="bg-white rounded-lg shadow-lg border border-gray-100 p-3 max-w-[240px]">
                            <div class="font-semibold text-base mb-2 text-gray-800 border-b pb-1.5" style="border-color: #4B5563">${court.name}</div>
                            <div class="space-y-1.5">
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Общая оценка</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.overall)}">${court.overall.toFixed(1)}</span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Здание</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.ratings[4])}">${court.ratings[4].toFixed(1)}</span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Канцелярия</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.ratings[3])}">${court.ratings[3].toFixed(1)}</span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Процесс</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.ratings[2])}">${court.ratings[2].toFixed(1)}</span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Сотрудники</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.ratings[1])}">${court.ratings[1].toFixed(1)}</span>
                              </div>
                              <div class="flex items-center justify-between border-l-2 pl-2" style="border-color: #4B5563">
                                <span class="text-gray-700 text-sm">Судья</span>
                                <span class="font-medium text-gray-900 px-1.5 py-0.5 rounded ${getRatingColor(court.ratings[0])}">${court.ratings[0].toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        `);
                    })
                    .on("mousemove", (event) => {
                      const coordinates = getEventCoordinates(event);
                      d3.select("#tooltip").style("left", `${coordinates.x}px`).style("top", `${coordinates.y}px`);
                    })
                    .on("mouseout", () => d3.select("#tooltip").style("display", "none"))
                    .on("click", () => handleCourtClick(court.id, court.name));
                }
              });
            }
          }}
          className="w-full h-full"
        />
      </div>
    );
  }, [selectedRegion, regionName, handleCourtClick, regions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) setIsSearchOpen(false);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1250px] mx-auto px-4 py-4">
        <div className="flex flex-col">
          <Breadcrumb regionName={regionName} onRegionBackClick={handleRegionBackClick} />
          <h2 className="text-xl font-medium mt-4">{regionName ? regionName : "Выберите регион"}</h2>
          {renderRegionMap()}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200">№</th>
                      <th
                        className="px-3 py lefft text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200"
                        style={{ width: "20%", minWidth: "250px" }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate mr-2">НАИМЕНОВАНИЕ СУДА</span>
                          <div className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${isSearchOpen ? "w-36" : "w-8"}`}>
                            <div className={`flex-grow transition-all duration-500 ease-in-out ${isSearchOpen ? "opacity-100 w-full" : "opacity-0 w-0"}`}>
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Поиск суда"
                                className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-lg outline-none"
                                autoFocus={isSearchOpen}
                              />
                            </div>
                            <div
                              className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-full flex-shrink-0"
                              onClick={handleSearchIconClick}
                            >
                              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("overall")}>
                        <div className="flex items-center justify-between px-2"><span>Общая оценка</span>{getSortIcon("overall")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("building")}>
                        <div className="flex items-center justify-between px-2"><span>Здание</span>{getSortIcon("building")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("office")}>
                        <div className="flex items-center justify-between px-2"><span>Канцелярия</span>{getSortIcon("office")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("process")}>
                        <div className="flex items-center justify-between px-2"><span>Процесс</span>{getSortIcon("process")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("staff")}>
                        <div className="flex items-center justify-between px-2"><span>Сотрудники</span>{getSortIcon("staff")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("judge")}>
                        <div className="flex items-center justify-between px-2"><span>Судья</span>{getSortIcon("judge")}</div>
                      </th>
                      <th className="px-3 py-2.5 text-center text-xs font-medium text-gray-500 uppercase bg-gray-50 border-r border-gray-200 cursor-pointer" onClick={() => handleSort("count")}>
                        <div className="flex items-center justify-between px-2"><span>Количество оценок</span></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="min-h-[300px]">
                    {filteredCourts.map((court, index) => (
                      <tr key={court.name} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">{index + 1}</td>
                        <td className="px-3 py-2.5 text-left text-xs text-gray-600 cursor-pointer hover:text-blue-500" onClick={() => handleCourtClick(court.id, court.name)}>{court.name}</td>
                        <td className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(court.overall)}`}>{court.overall.toFixed(1)}</td>
                        {court.ratings.map((rating: number, idx: number) => (
                          <td key={idx} className={`border border-gray-300 px-4 py-2 text-center text-sm text-gray-900 ${getRatingColor(rating)}`}>{rating.toFixed(1)}</td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-600">{court.totalAssessments}</td>
                      </tr>
                    ))}
                    {filteredCourts.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-gray-500 h-[300px]">{searchQuery ? "Ничего не найдено" : "Нет данных"}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="block sm:hidden p-3">
                {filteredCourts.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">{searchQuery ? "Ничего не найдено" : "Нет данных"}</div>
                ) : (
                  filteredCourts.map((court, index) => (
                    <div
                      key={court.name}
                      className="mb-3 p-3 border border-gray-100 rounded-lg bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => handleCourtClick(court.id, court.name)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-semibold text-gray-800 hover:text-blue-600 truncate">{index + 1}. {court.name}</div>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm font-medium text-gray-700">{court.overall.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1"><span className="font-medium">Здание:</span><span>{court.ratings[0].toFixed(1)}</span></div>
                        <div className="flex items-center gap-1"><span className="font-medium">Канцелярия:</span><span>{court.ratings[1].toFixed(1)}</span></div>
                        <div className="flex items-center gap-1"><span className="font-medium">Процесс:</span><span>{court.ratings[2].toFixed(1)}</span></div>
                        <div className="flex items-center gap-1"><span className="font-medium">Сотрудники:</span><span>{court.ratings[3].toFixed(1)}</span></div>
                        <div className="flex items-center gap-1"><span className="font-medium">Судья:</span><span>{court.ratings[4].toFixed(1)}</span></div>
                        <div className="flex items-center gap-1"><span className="font-medium">Отзывы:</span><span>{court.totalAssessments}</span></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionDetails;