import { Request, Response } from "express";
import { supabaseClient, supabaseAdmin } from "../../supabase.js";

// https://www.thebluealliance.com/api/v3/team/frc4188
interface TBATeamData {
  key: string;
  team_number: number;
  nickname: string | null;
  name: string | null;
  school_name: string | null;
  city: string | null;
  state_prov: string | null;
  country: string | null;
  address: string | null;
  postal_code: string | null;
  gmaps_place_id: string | null;
  gmaps_url: string | null;
  lat: number | null;
  lng: number | null;
  location_name: string | null;
  website: string | null;
  rookie_year: number;
  motto: string | null;
}

// https://www.thebluealliance.com/api/v3/team/frc4188/awards/2026
interface Award {
  name: string;
  award_type: number;
  event_key: string;
  recipient_list: Recipient[];
  year: number;
}

interface Recipient {
  team_key: string | null;
  awardee: string | null;
}

// https://www.thebluealliance.com/api/v3/team/frc4188/districts
interface District {
  abbreviation: string;
  display_name: string;
  key: string;
  year: number;
  official_advancement_counts: {
    cmp: number;
    dcmp: number;
  };
}

// https://api.statbotics.io/v3/team_year/4188/2026
interface StatboticsTeamYearData {
  team: number;
  year: number;
  name: string;
  country: string;
  state: string;
  district: string;
  rookie_year: number;
  epa: {
    total_points: {
      mean: number;
      sd: number;
    };
    unitless: number;
    norm: number;
    conf: number[];
    breakdown: {
      total_points: number;
      auto_points: number;
      teleop_points: number;
      endgame_points: number;
      energized_rp: number;
      supercharged_rp: number;
      traversal_rp: number;
      tiebreaker_points: number;
      auto_fuel: number;
      auto_tower: number;
      transition_fuel: number;
      first_shift_fuel: number;
      second_shift_fuel: number;
      teleop_fuel: number;
      endgame_fuel: number;
      endgame_tower: number;
      total_fuel: number;
      total_tower: number;
      rp_1: number;
      rp_2: number;
      rp_3: number;
    };
    stats: {
      start: number;
      pre_champs: number;
      max: number;
    };
    ranks: {
      total: {
        rank: number;
        percentile: number;
        team_count: number;
      };
      country: {
        rank: number;
        percentile: number;
        team_count: number;
      };
      state: {
        rank: number;
        percentile: number;
        team_count: number;
      };
      district: {
        rank: number;
        percentile: number;
        team_count: number;
      };
    };
  };
  record: {
    wins: number;
    losses: number;
    ties: number;
    count: number;
    winrate: number;
  };
  competing: {
    this_week: boolean;
    next_event_key: string;
    next_event_name: string;
    next_event_week: number;
  };
}

// for one team
// https://www.thebluealliance.com/api/v3/team/frc4188
// https://www.thebluealliance.com/api/v3/team/frc4188/years_participated
// https://www.thebluealliance.com/api/v3/team/frc4188/awards/2026
// https://www.thebluealliance.com/api/v3/team/frc4188/districts
// https://api.statbotics.io/v3/team_year/4188/2026

//huh
interface SingleTeamFetchParams {
  number: string;
}

//TODO: implement Etag If-None-Match into api calls
//ehhh maybe not (i'll see)
export const getSingleTeamData = async (
  req: Request<SingleTeamFetchParams>,
  res: Response,
): Promise<Response> => {
  //try catches are so cool
  try {
    const teamNum = req.query.number;
    console.log(teamNum);

    if (!teamNum) {
      return res
        .status(400)
        .json({ error: "Please input a team number parameter." });
    }

    //For team name, rookie year
    const response1 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response1.ok) {
      throw new Error(
        `The TBA API responded with status code ${response1.status}`,
      );
    }

    const data1 = (await response1.json()) as TBATeamData;

    //For award num
    const response2 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/awards/2026
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response2.ok) {
      throw new Error(
        `The TBA API responded with status code ${response2.status}`,
      );
    }

    const data2 = (await response2.json()) as Award[];

    //For num years participating with FIRST
    const response3 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/years_participated
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response3.ok) {
      throw new Error(
        `The TBA API responded with status code ${response3.status}`,
      );
    }

    const data3 = (await response3.json()) as number[];

    //For area
    const response4 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/districts
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response4.ok) {
      throw new Error(
        `The TBA API responded with status code ${response4.status}`,
      );
    }

    const data4 = (await response4.json()) as District[];
    const data4_ =
      data4.length > 0 ? data4[data4.length - 1].display_name : "Regional";

    const response5 =
      data4.length > 0
        ? await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026${data4[data4.length - 1].abbreviation}/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          )
        : await fetch(
            `https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

    if (!response5.ok) {
      throw new Error(
        `The TBA API responded with status code ${response5.status}`,
      );
    }

    const data5 = (await response5.json()) as TBAAreaData[];
    const data5_ = data5.find(
      (data) => data.team_key === `frc${teamNum}`,
    )?.rank;

    //for unitless epa and epa rank
    const response6 = await fetch(
      `https://api.statbotics.io/v3/team_year/${teamNum}/2026
`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      },
    );

    if (!response6.ok) {
      throw new Error(
        `The Statbotics API responded with status code ${response6.status}`,
      );
    }

    const data6 = (await response6.json()) as StatboticsTeamYearData;

    //final, returnable data
    const returnData = {
      teamNum: teamNum,
      teamName: data1.nickname,
      area: data4_,
      areaRank: data5_,
      rookieYear: data1.rookie_year,
      numYearsParticipating: data3.length,
      unitlessEPA: data6.epa.unitless,
      epaRank: data6.epa.ranks.district.rank,
      worldEPARank: data6.epa.ranks.total.rank,
      totalNumTeams: data6.epa.ranks.district.team_count,
      awardNum: data2.length,
    };

    return res.status(200).json(returnData);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "There was an issue with the server." });
  }
};

export const testAgainin = async (
  req: Request<SingleTeamFetchParams>,
  res: Response,
): Promise<Response> => {
  const teamNum = req.query.number;
  console.log(teamNum);

  if (!teamNum) {
    return res
      .status(400)
      .json({ error: "Please input a team number parameter." });
  }

  try {
    const { data: mainData, error: dbError } = await supabaseClient
      .from("frcdle_team_data")
      .select("*");

    const SIX_HOURS = 6 * 60 * 60 * 1000;
    //const ONE_DAY = 24 * 60 * 60 * 1000;
    const timeNow = Date.now();

    const dataStale =
      mainData!.length === 0 ||
      timeNow - new Date(mainData![0]?.timestamp).getTime() > SIX_HOURS;

    const response1 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response1.ok) {
      throw new Error(
        `The TBA API responded with status code ${response1.status}`,
      );
    }

    const data1 = (await response1.json()) as TBATeamData;

    //For award num
    const response2 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/awards/2026
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response2.ok) {
      throw new Error(
        `The TBA API responded with status code ${response2.status}`,
      );
    }

    const data2 = (await response2.json()) as Award[];

    //For num years participating with FIRST
    const response3 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/years_participated
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response3.ok) {
      throw new Error(
        `The TBA API responded with status code ${response3.status}`,
      );
    }

    const data3 = (await response3.json()) as number[];

    //For area
    const response4 = await fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${teamNum}/districts
`,
      {
        method: "GET",
        headers: {
          "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
          accept: "application/json",
        },
      },
    );

    if (!response4.ok) {
      throw new Error(
        `The TBA API responded with status code ${response4.status}`,
      );
    }

    const data4 = (await response4.json()) as District[];
    const data4_ =
      data4.length > 0 ? data4[data4.length - 1].display_name : "Regional";

    const response5 =
      data4.length > 0
        ? await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026${data4[data4.length - 1].abbreviation}/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          )
        : await fetch(
            `https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

    if (!response5.ok) {
      throw new Error(
        `The TBA API responded with status code ${response5.status}`,
      );
    }

    const data5 = (await response5.json()) as TBAAreaData[];
    const data5_ = data5.find(
      (data) => data.team_key === `frc${teamNum}`,
    )?.rank;

    //for unitless epa and epa rank
    const response6 = await fetch(
      `https://api.statbotics.io/v3/team_year/${teamNum}/2026
`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      },
    );

    if (!response6.ok) {
      throw new Error(
        `The Statbotics API responded with status code ${response6.status}`,
      );
    }

    const data6 = (await response6.json()) as StatboticsTeamYearData;

    //final, returnable data
    const returnData = {
      teamNum: teamNum,
      teamName: data1.nickname,
      area: data4_,
      areaRank: data5_,
      rookieYear: data1.rookie_year,
      numYearsParticipating: data3.length,
      unitlessEPA: data6.epa.unitless,
      epaRank: data6.epa.ranks.district.rank,
      worldEPARank: data6.epa.ranks.total.rank,
      totalNumTeams: data6.epa.ranks.district.team_count,
      awardNum: data2.length,
    };

    if (dataStale) {
      await supabaseAdmin.from("frcdle_team_data").upsert([returnData]);
    }

    console.log("used api");
    return res.status(200).json(returnData);
  } catch (error: any) {
    console.error(error);
    try {
      const team = teamNum.toString();
      const { data, error } = await supabaseClient
        .from("frcdle_team_data")
        .select("*")
        .eq("teamNum", parseInt(team));

      if (error) {
        throw error;
      }

      console.log("used db");
      return res.status(200).json(data);
    } catch (error: any) {
      console.error(error);
      throw error;
      // return res.status(error.status);
    }
  }
};

interface TBAAreaData {
  adjustments: number;
  event_points: EventPoints[];
  point_total: number;
  rank: number;
  rookie_bonus: number;
  single_event_bonus: number;
  team_key: string;
}

interface EventPoints {
  alliance_points: number;
  award_points: number;
  elim_points: number;
  event_key: string;
  qual_points: number;
  total: number;
}

//so it knows that "req.query.district" actually exists
interface MultiTeamFetchParams {
  district: string;
}

export const getAreaTeamData = async (
  req: Request<MultiTeamFetchParams>,
  res: Response,
): Promise<Response> => {
  try {
    const area = req.query.district;
    console.log(area);

    if (!area) {
      return res.status(400).json({ error: "Please input an area parameter." });
    }

    if (area === "regionals") {
      const response1 = await fetch(
        "https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings",
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response1.ok) {
        throw new Error(
          `The TBA API responded with status code ${response1.status}`,
        );
      }

      const data1 = (await response1.json()) as TBAAreaData[];
      const data1_ = data1.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      let offset = 0;
      let regionalTeams: StatboticsTeamYearData[] = [];
      let curPulledTeams: StatboticsTeamYearData[];
      do {
        const response2 =
          offset == 0
            ? await fetch("https://api.statbotics.io/v3/team_years?year=2026", {
                method: "GET",
                headers: {
                  accept: "application/json",
                },
              })
            : await fetch(
                `https://api.statbotics.io/v3/team_years?year=2026&offset=${offset}`,
                {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                  },
                },
              );
        if (!response2.ok) {
          throw new Error(
            `The Statbotics API responded with status code: ${response2.status}`,
          );
        }
        curPulledTeams = (await response2.json()) as StatboticsTeamYearData[];
        regionalTeams =
          offset == 0 ? curPulledTeams : [...regionalTeams, ...curPulledTeams];
        offset += 1000;
      } while (curPulledTeams.length >= 1000);

      const data2 = [];
      for (let i = 0; i < regionalTeams.length; i++) {
        if (
          !regionalTeams[i].district &&
          regionalTeams[i].record.count !== 0 &&
          !regionalTeams[i].name.includes("Off-Season Demo Team")
        ) {
          data2.push({
            teamNum: regionalTeams[i].team,
            teamName: regionalTeams[i].name,
            rookieYear: regionalTeams[i].rookie_year,
            unitlessEPA: regionalTeams[i].epa.unitless,
            epaRank: regionalTeams[i].epa.ranks.district.rank,
            worldEPARank: regionalTeams[i].epa.ranks.total.rank,
            totalNumTeams: regionalTeams[i].epa.ranks.district.team_count,
          });
        }
      }

      const returnableData = [];
      for (let i = 0; i < data2.length; i++) {
        returnableData.push({
          teamNum: data2[i].teamNum,
          teamName: data2[i].teamName,
          rookieYear: data2[i].rookieYear,
          unitlessEPA: data2[i].unitlessEPA,
          epaRank: data2[i].epaRank,
          worldEPARank: data2[i].worldEPARank,
          areaRank: data1_[i].rank,
          totalNumTeams: data2[i].totalNumTeams,
        });
      }

      return res.status(200).json(returnableData);
    } else {
      //For everything except area rank
      const response1 = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=${area}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1.status}`,
        );
      }

      const data1 = (await response1.json()) as StatboticsTeamYearData[];

      const response2 = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026${area}/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2.status}`,
        );
      }

      const data2 = (await response2.json()) as TBAAreaData[];
      const data2_ = data2.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const returnableData = [];
      for (let i = 0; i < data1.length; i++) {
        returnableData.push({
          teamNum: data1[i].team,
          teamName: data1[i].name,
          rookieYear: data1[i].rookie_year,
          unitlessEPA: data1[i].epa.unitless,
          epaRank: data1[i].epa.ranks.district.rank,
          worldEPARank: data1[i].epa.ranks.total.rank,
          areaRank: data2_[i].rank,
        });
      }

      return res.status(200).json(returnableData);
    }
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "There was an issue with the server." });
  }
};

interface DataBaseParams {
  areaRank: number | null;
  epaRank: number | null;
  rookieYear: number | null;
  teamName: string | null;
  teamNum: number;
  timestamp: string;
  totalNumTeams: number | null;
  unitlessEPA: number | null;
  worldEPARank: number | null;
}

//this one has the db tables as a backup to the api data
/*if the user cannot fetch the most up to date data from the APIs,
  they'll fetch from the database.
*/
export const testAgain = async (
  req: Request<MultiTeamFetchParams>,
  res: Response,
): Promise<Response> => {
  const area = req.query.district;
  console.log(area);

  try {
    if (!area) {
      return res.status(400).json({ error: "Please input an area parameter." });
    }

    const mainResponse = await (area === "all"
      ? supabaseClient.from("frcdle_all").select("*")
      : area === "ca"
        ? supabaseClient.from("frcdle_ca").select("*")
        : area === "fch"
          ? supabaseClient.from("frcdle_fch").select("*")
          : area === "fim"
            ? supabaseClient.from("frcdle_fim").select("*")
            : area === "fin"
              ? supabaseClient.from("frcdle_fin").select("*")
              : area === "fit"
                ? supabaseClient.from("frcdle_fit").select("*")
                : area === "fma"
                  ? supabaseClient.from("frcdle_fma").select("*")
                  : area === "fnc"
                    ? supabaseClient.from("frcdle_fnc").select("*")
                    : area === "fsc"
                      ? supabaseClient.from("frcdle_fsc").select("*")
                      : area === "isr"
                        ? supabaseClient.from("frcdle_isr").select("*")
                        : area === "ne"
                          ? supabaseClient.from("frcdle_ne").select("*")
                          : area === "ont"
                            ? supabaseClient.from("frcdle_ont").select("*")
                            : area === "pch"
                              ? supabaseClient.from("frcdle_pch").select("*")
                              : area === "pnw"
                                ? supabaseClient.from("frcdle_pnw").select("*")
                                : area === "win"
                                  ? supabaseClient
                                      .from("frcdle_win")
                                      .select("*")
                                  : area === "regionals"
                                    ? supabaseClient
                                        .from("frcdle_regionals")
                                        .select("*")
                                    : null);

    const mainCache = mainResponse?.data;

    const SIX_HOURS = 6 * 60 * 60 * 1000;
    //const ONE_DAY = 24 * 60 * 60 * 1000;
    const timeNow = Date.now();

    const dataStale =
      mainCache!.length === 0 ||
      timeNow - new Date(mainCache![0]?.timestamp).getTime() > SIX_HOURS;

    if (area === "regionals") {
      const response1 = await fetch(
        "https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings",
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response1.ok) {
        throw new Error(
          `The TBA API responded with status code ${response1.status}`,
        );
      }

      const data1 = (await response1.json()) as TBAAreaData[];
      const data1_ = data1.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      let offset = 0;
      let regionalTeams: StatboticsTeamYearData[] = [];
      let curPulledTeams: StatboticsTeamYearData[];
      do {
        const response2 =
          offset == 0
            ? await fetch("https://api.statbotics.io/v3/team_years?year=2026", {
                method: "GET",
                headers: {
                  accept: "application/json",
                },
              })
            : await fetch(
                `https://api.statbotics.io/v3/team_years?year=2026&offset=${offset}`,
                {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                  },
                },
              );
        if (!response2.ok) {
          throw new Error(
            `The Statbotics API responded with status code: ${response2.status}`,
          );
        }
        curPulledTeams = (await response2.json()) as StatboticsTeamYearData[];
        regionalTeams =
          offset == 0 ? curPulledTeams : [...regionalTeams, ...curPulledTeams];
        offset += 1000;
      } while (curPulledTeams.length >= 1000);

      const data2 = [];
      for (let i = 0; i < regionalTeams.length; i++) {
        if (
          !regionalTeams[i].district &&
          regionalTeams[i].record.count !== 0 &&
          !regionalTeams[i].name.includes("Off-Season Demo Team")
        ) {
          data2.push({
            teamNum: regionalTeams[i].team,
            teamName: regionalTeams[i].name,
            rookieYear: regionalTeams[i].rookie_year,
            unitlessEPA: regionalTeams[i].epa.unitless,
            epaRank: regionalTeams[i].epa.ranks.district.rank,
            worldEPARank: regionalTeams[i].epa.ranks.total.rank,
            totalNumTeams: regionalTeams[i].epa.ranks.district.team_count,
          });
        }
      }

      const returnableData = [];
      for (let i = 0; i < data2.length; i++) {
        returnableData.push({
          teamNum: data2[i].teamNum,
          teamName: data2[i].teamName,
          rookieYear: data2[i].rookieYear,
          unitlessEPA: data2[i].unitlessEPA,
          epaRank: data2[i].epaRank,
          worldEPARank: data2[i].worldEPARank,
          areaRank: data1_[i].rank,
          totalNumTeams: data2[i].totalNumTeams,
        });
      }

      if (dataStale) {
        await supabaseAdmin.from("frcdle_regionals").upsert(returnableData);
      }

      console.log("used api");
      return res.status(200).json(returnableData);
    } else if (area === "all") {
      const response1Regional = await fetch(
        "https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings",
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response1Regional.ok) {
        throw new Error(
          `The TBA API responded with status code ${response1Regional.status}`,
        );
      }

      const data1Regional = (await response1Regional.json()) as TBAAreaData[];
      const data1Regional_ = data1Regional.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      let offset = 0;
      let regionalTeams: StatboticsTeamYearData[] = [];
      let curPulledTeams: StatboticsTeamYearData[];
      do {
        const response2Regional =
          offset == 0
            ? await fetch("https://api.statbotics.io/v3/team_years?year=2026", {
                method: "GET",
                headers: {
                  accept: "application/json",
                },
              })
            : await fetch(
                `https://api.statbotics.io/v3/team_years?year=2026&offset=${offset}`,
                {
                  method: "GET",
                  headers: {
                    accept: "application/json",
                  },
                },
              );
        if (!response2Regional.ok) {
          throw new Error(
            `The Statbotics API responded with status code: ${response2Regional.status}`,
          );
        }
        curPulledTeams =
          (await response2Regional.json()) as StatboticsTeamYearData[];
        regionalTeams =
          offset == 0 ? curPulledTeams : [...regionalTeams, ...curPulledTeams];
        offset += 1000;
      } while (curPulledTeams.length >= 1000);

      const data2Regional = [];
      for (let i = 0; i < regionalTeams.length; i++) {
        if (
          !regionalTeams[i].district &&
          regionalTeams[i].record.count !== 0 &&
          !regionalTeams[i].name.includes("Off-Season Demo Team")
        ) {
          data2Regional.push({
            teamNum: regionalTeams[i].team,
            teamName: regionalTeams[i].name,
            rookieYear: regionalTeams[i].rookie_year,
            unitlessEPA: regionalTeams[i].epa.unitless,
            epaRank: regionalTeams[i].epa.ranks.district.rank,
            worldEPARank: regionalTeams[i].epa.ranks.total.rank,
            totalNumTeams: regionalTeams[i].epa.ranks.district.team_count,
          });
        }
      }

      const regionalData = [];
      for (let i = 0; i < data2Regional.length; i++) {
        regionalData.push({
          teamNum: data2Regional[i].teamNum,
          teamName: data2Regional[i].teamName,
          rookieYear: data2Regional[i].rookieYear,
          unitlessEPA: data2Regional[i].unitlessEPA,
          epaRank: data2Regional[i].epaRank,
          worldEPARank: data2Regional[i].worldEPARank,
          areaRank: data1Regional_[i].rank,
          totalNumTeams: data2Regional[i].totalNumTeams,
        });
      }

      const response1ca = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=ca`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1ca.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1ca.status}`,
        );
      }

      const data1ca = (await response1ca.json()) as StatboticsTeamYearData[];

      const response2ca = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026ca/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2ca.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2ca.status}`,
        );
      }

      const data2ca = (await response2ca.json()) as TBAAreaData[];
      const data2ca_ = data2ca.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const caData = [];
      for (let i = 0; i < data1ca.length; i++) {
        caData.push({
          teamNum: data1ca[i].team,
          teamName: data1ca[i].name,
          rookieYear: data1ca[i].rookie_year,
          unitlessEPA: data1ca[i].epa.unitless,
          epaRank: data1ca[i].epa.ranks.district.rank,
          worldEPARank: data1ca[i].epa.ranks.total.rank,
          areaRank: data2ca_[i].rank,
        });
      }

      const response1fch = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fch`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fch.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fch.status}`,
        );
      }

      const data1fch = (await response1fch.json()) as StatboticsTeamYearData[];

      const response2fch = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fch/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fch.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fch.status}`,
        );
      }

      const data2fch = (await response2fch.json()) as TBAAreaData[];
      const data2fch_ = data2fch.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fchData = [];
      for (let i = 0; i < data1fch.length; i++) {
        fchData.push({
          teamNum: data1fch[i].team,
          teamName: data1fch[i].name,
          rookieYear: data1fch[i].rookie_year,
          unitlessEPA: data1fch[i].epa.unitless,
          epaRank: data1fch[i].epa.ranks.district.rank,
          worldEPARank: data1fch[i].epa.ranks.total.rank,
          areaRank: data2fch_[i].rank,
        });
      }

      const response1fim = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fim`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fim.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fim.status}`,
        );
      }

      const data1fim = (await response1fim.json()) as StatboticsTeamYearData[];

      const response2fim = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fim/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fim.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fim.status}`,
        );
      }

      const data2fim = (await response2fim.json()) as TBAAreaData[];
      const data2fim_ = data2fim.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fimData = [];
      for (let i = 0; i < data1fim.length; i++) {
        fimData.push({
          teamNum: data1fim[i].team,
          teamName: data1fim[i].name,
          rookieYear: data1fim[i].rookie_year,
          unitlessEPA: data1fim[i].epa.unitless,
          epaRank: data1fim[i].epa.ranks.district.rank,
          worldEPARank: data1fim[i].epa.ranks.total.rank,
          areaRank: data2fim_[i].rank,
        });
      }

      const response1fin = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fin`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fin.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fin.status}`,
        );
      }

      const data1fin = (await response1fin.json()) as StatboticsTeamYearData[];

      const response2fin = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fin/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fin.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fin.status}`,
        );
      }

      const data2fin = (await response2fin.json()) as TBAAreaData[];
      const data2fin_ = data2fin.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const finData = [];
      for (let i = 0; i < data1fin.length; i++) {
        finData.push({
          teamNum: data1fin[i].team,
          teamName: data1fin[i].name,
          rookieYear: data1fin[i].rookie_year,
          unitlessEPA: data1fin[i].epa.unitless,
          epaRank: data1fin[i].epa.ranks.district.rank,
          worldEPARank: data1fin[i].epa.ranks.total.rank,
          areaRank: data2fin_[i].rank,
        });
      }

      const response1fit = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fit`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fit.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fit.status}`,
        );
      }

      const data1fit = (await response1fit.json()) as StatboticsTeamYearData[];

      const response2fit = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fit/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fit.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fit.status}`,
        );
      }

      const data2fit = (await response2fit.json()) as TBAAreaData[];
      const data2fit_ = data2fit.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fitData = [];
      for (let i = 0; i < data1fit.length; i++) {
        fitData.push({
          teamNum: data1fit[i].team,
          teamName: data1fit[i].name,
          rookieYear: data1fit[i].rookie_year,
          unitlessEPA: data1fit[i].epa.unitless,
          epaRank: data1fit[i].epa.ranks.district.rank,
          worldEPARank: data1fit[i].epa.ranks.total.rank,
          areaRank: data2fit_[i].rank,
        });
      }

      const response1fma = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fma`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fma.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fma.status}`,
        );
      }

      const data1fma = (await response1fma.json()) as StatboticsTeamYearData[];

      const response2fma = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fma/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fma.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fma.status}`,
        );
      }

      const data2fma = (await response2fma.json()) as TBAAreaData[];
      const data2fma_ = data2fma.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fmaData = [];
      for (let i = 0; i < data1fma.length; i++) {
        fmaData.push({
          teamNum: data1fma[i].team,
          teamName: data1fma[i].name,
          rookieYear: data1fma[i].rookie_year,
          unitlessEPA: data1fma[i].epa.unitless,
          epaRank: data1fma[i].epa.ranks.district.rank,
          worldEPARank: data1fma[i].epa.ranks.total.rank,
          areaRank: data2fma_[i].rank,
        });
      }

      const response1fnc = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fnc`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fnc.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fnc.status}`,
        );
      }

      const data1fnc = (await response1fnc.json()) as StatboticsTeamYearData[];

      const response2fnc = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fnc/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fnc.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fnc.status}`,
        );
      }

      const data2fnc = (await response2fnc.json()) as TBAAreaData[];
      const data2fnc_ = data2fnc.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fncData = [];
      for (let i = 0; i < data1fnc.length; i++) {
        fncData.push({
          teamNum: data1fnc[i].team,
          teamName: data1fnc[i].name,
          rookieYear: data1fnc[i].rookie_year,
          unitlessEPA: data1fnc[i].epa.unitless,
          epaRank: data1fnc[i].epa.ranks.district.rank,
          worldEPARank: data1fnc[i].epa.ranks.total.rank,
          areaRank: data2fnc_[i].rank,
        });
      }

      const response1fsc = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=fsc`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1fsc.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1fsc.status}`,
        );
      }

      const data1fsc = (await response1fsc.json()) as StatboticsTeamYearData[];

      const response2fsc = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026fsc/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2fsc.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2fsc.status}`,
        );
      }

      const data2fsc = (await response2fsc.json()) as TBAAreaData[];
      const data2fsc_ = data2fsc.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const fscData = [];
      for (let i = 0; i < data1fsc.length; i++) {
        fscData.push({
          teamNum: data1fsc[i].team,
          teamName: data1fsc[i].name,
          rookieYear: data1fsc[i].rookie_year,
          unitlessEPA: data1fsc[i].epa.unitless,
          epaRank: data1fsc[i].epa.ranks.district.rank,
          worldEPARank: data1fsc[i].epa.ranks.total.rank,
          areaRank: data2fsc_[i].rank,
        });
      }

      const response1isr = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=isr`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1isr.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1isr.status}`,
        );
      }

      const data1isr = (await response1isr.json()) as StatboticsTeamYearData[];

      const response2isr = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026isr/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2isr.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2isr.status}`,
        );
      }

      const data2isr = (await response2isr.json()) as TBAAreaData[];
      const data2isr_ = data2isr.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const isrData = [];
      for (let i = 0; i < data1isr.length; i++) {
        isrData.push({
          teamNum: data1isr[i].team,
          teamName: data1isr[i].name,
          rookieYear: data1isr[i].rookie_year,
          unitlessEPA: data1isr[i].epa.unitless,
          epaRank: data1isr[i].epa.ranks.district.rank,
          worldEPARank: data1isr[i].epa.ranks.total.rank,
          areaRank: data2isr_[i].rank,
        });
      }

      const response1ne = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=ne`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1ne.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1ne.status}`,
        );
      }

      const data1ne = (await response1ne.json()) as StatboticsTeamYearData[];

      const response2ne = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026ne/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2ne.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2ne.status}`,
        );
      }

      const data2ne = (await response2ne.json()) as TBAAreaData[];
      const data2ne_ = data2ne.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const neData = [];
      for (let i = 0; i < data1ne.length; i++) {
        neData.push({
          teamNum: data1ne[i].team,
          teamName: data1ne[i].name,
          rookieYear: data1ne[i].rookie_year,
          unitlessEPA: data1ne[i].epa.unitless,
          epaRank: data1ne[i].epa.ranks.district.rank,
          worldEPARank: data1ne[i].epa.ranks.total.rank,
          areaRank: data2ne_[i].rank,
        });
      }

      const response1ont = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=ont`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1ont.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1ont.status}`,
        );
      }

      const data1ont = (await response1ont.json()) as StatboticsTeamYearData[];

      const response2ont = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026ont/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2ont.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2ont.status}`,
        );
      }

      const data2ont = (await response2ont.json()) as TBAAreaData[];
      const data2ont_ = data2ont.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const ontData = [];
      for (let i = 0; i < data1ont.length; i++) {
        ontData.push({
          teamNum: data1ont[i].team,
          teamName: data1ont[i].name,
          rookieYear: data1ont[i].rookie_year,
          unitlessEPA: data1ont[i].epa.unitless,
          epaRank: data1ont[i].epa.ranks.district.rank,
          worldEPARank: data1ont[i].epa.ranks.total.rank,
          areaRank: data2ont_[i].rank,
        });
      }

      const response1pch = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=pch`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1pch.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1pch.status}`,
        );
      }

      const data1pch = (await response1pch.json()) as StatboticsTeamYearData[];

      const response2pch = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026${area}/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2pch.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2pch.status}`,
        );
      }

      const data2pch = (await response2pch.json()) as TBAAreaData[];
      const data2pch_ = data2pch.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const pchData = [];
      for (let i = 0; i < data1pch.length; i++) {
        pchData.push({
          teamNum: data1pch[i].team,
          teamName: data1pch[i].name,
          rookieYear: data1pch[i].rookie_year,
          unitlessEPA: data1pch[i].epa.unitless,
          epaRank: data1pch[i].epa.ranks.district.rank,
          worldEPARank: data1pch[i].epa.ranks.total.rank,
          areaRank: data2pch_[i].rank,
        });
      }

      const response1pnw = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=pnw`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1pnw.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1pnw.status}`,
        );
      }

      const data1pnw = (await response1pnw.json()) as StatboticsTeamYearData[];

      const response2pnw = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026pnw/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2pnw.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2pnw.status}`,
        );
      }

      const data2pnw = (await response2pnw.json()) as TBAAreaData[];
      const data2pnw_ = data2pnw.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const pnwData = [];
      for (let i = 0; i < data1pnw.length; i++) {
        pnwData.push({
          teamNum: data1pnw[i].team,
          teamName: data1pnw[i].name,
          rookieYear: data1pnw[i].rookie_year,
          unitlessEPA: data1pnw[i].epa.unitless,
          epaRank: data1pnw[i].epa.ranks.district.rank,
          worldEPARank: data1pnw[i].epa.ranks.total.rank,
          areaRank: data2pnw_[i].rank,
        });
      }

      const response1win = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=win`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1win.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1win.status}`,
        );
      }

      const data1win = (await response1win.json()) as StatboticsTeamYearData[];

      const response2win = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026win/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2win.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2win.status}`,
        );
      }

      const data2win = (await response2win.json()) as TBAAreaData[];
      const data2win_ = data2win.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const winData = [];
      for (let i = 0; i < data1win.length; i++) {
        winData.push({
          teamNum: data1win[i].team,
          teamName: data1win[i].name,
          rookieYear: data1win[i].rookie_year,
          unitlessEPA: data1win[i].epa.unitless,
          epaRank: data1win[i].epa.ranks.district.rank,
          worldEPARank: data1win[i].epa.ranks.total.rank,
          areaRank: data2win_[i].rank,
        });
      }

      const finalData = [
        ...caData,
        ...fchData,
        ...fimData,
        ...finData,
        ...fitData,
        ...fmaData,
        ...fncData,
        ...fscData,
        ...isrData,
        ...neData,
        ...ontData,
        ...pchData,
        ...pnwData,
        ...winData,
        ...regionalData,
      ];

      if (dataStale) {
        await supabaseAdmin.from("frcdle_all").upsert(finalData);
      }

      console.log("used api");
      return res.status(200).json(finalData);
    } else {
      const response1 = await fetch(
        `https://api.statbotics.io/v3/team_years?year=2026&district=${area}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response1.ok) {
        throw new Error(
          `The Statbotics API responded with status code: ${response1.status}`,
        );
      }

      const data1 = (await response1.json()) as StatboticsTeamYearData[];

      const response2 = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026${area}/rankings`,
        {
          method: "GET",
          headers: {
            "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
            accept: "application/json",
          },
        },
      );

      if (!response2.ok) {
        throw new Error(
          `The TBA API responded with status code ${response2.status}`,
        );
      }

      const data2 = (await response2.json()) as TBAAreaData[];
      const data2_ = data2.sort(
        (a, b) =>
          parseInt(a.team_key.replace(/\D/g, "")) -
          parseInt(b.team_key.replace(/\D/g, "")),
      );

      const returnableData = [];
      for (let i = 0; i < data1.length; i++) {
        returnableData.push({
          teamNum: data1[i].team,
          teamName: data1[i].name,
          rookieYear: data1[i].rookie_year,
          unitlessEPA: data1[i].epa.unitless,
          epaRank: data1[i].epa.ranks.district.rank,
          worldEPARank: data1[i].epa.ranks.total.rank,
          areaRank: data2_[i].rank,
        });
      }

      if (dataStale) {
        await (area === "ca"
          ? supabaseAdmin.from("frcdle_ca").upsert(returnableData)
          : area === "fch"
            ? supabaseAdmin.from("frcdle_fch").upsert(returnableData)
            : area === "fim"
              ? supabaseAdmin.from("frcdle_fim").upsert(returnableData)
              : area === "fin"
                ? supabaseAdmin.from("frcdle_fin").upsert(returnableData)
                : area === "fit"
                  ? supabaseAdmin.from("frcdle_fit").upsert(returnableData)
                  : area === "fma"
                    ? supabaseAdmin.from("frcdle_fma").upsert(returnableData)
                    : area === "fnc"
                      ? supabaseAdmin.from("frcdle_fnc").upsert(returnableData)
                      : area === "fsc"
                        ? supabaseAdmin
                            .from("frcdle_fsc")
                            .upsert(returnableData)
                        : area === "isr"
                          ? supabaseAdmin
                              .from("frcdle_isr")
                              .upsert(returnableData)
                          : area === "ne"
                            ? supabaseAdmin
                                .from("frcdle_ne")
                                .upsert(returnableData)
                            : area === "ont"
                              ? supabaseAdmin
                                  .from("frcdle_ont")
                                  .upsert(returnableData)
                              : area === "pch"
                                ? supabaseAdmin
                                    .from("frcdle_pch")
                                    .upsert(returnableData)
                                : area === "pnw"
                                  ? supabaseAdmin
                                      .from("frcdle_pnw")
                                      .upsert(returnableData)
                                  : area === "win"
                                    ? supabaseAdmin
                                        .from("frcdle_win")
                                        .upsert(returnableData)
                                    : null);
      }
      console.log("used api");
      return res.status(200).json(returnableData);
    }
  } catch (error: any) {
    console.error(error);
    try {
      const mainResponse = await (area === "all"
        ? supabaseClient.from("frcdle_all").select("*")
        : area === "ca"
          ? supabaseClient.from("frcdle_ca").select("*")
          : area === "fch"
            ? supabaseClient.from("frcdle_fch").select("*")
            : area === "fim"
              ? supabaseClient.from("frcdle_fim").select("*")
              : area === "fin"
                ? supabaseClient.from("frcdle_fin").select("*")
                : area === "fit"
                  ? supabaseClient.from("frcdle_fit").select("*")
                  : area === "fma"
                    ? supabaseClient.from("frcdle_fma").select("*")
                    : area === "fnc"
                      ? supabaseClient.from("frcdle_fnc").select("*")
                      : area === "fsc"
                        ? supabaseClient.from("frcdle_fsc").select("*")
                        : area === "isr"
                          ? supabaseClient.from("frcdle_isr").select("*")
                          : area === "ne"
                            ? supabaseClient.from("frcdle_ne").select("*")
                            : area === "ont"
                              ? supabaseClient.from("frcdle_ont").select("*")
                              : area === "pch"
                                ? supabaseClient.from("frcdle_pch").select("*")
                                : area === "pnw"
                                  ? supabaseClient
                                      .from("frcdle_pnw")
                                      .select("*")
                                  : area === "win"
                                    ? supabaseClient
                                        .from("frcdle_win")
                                        .select("*")
                                    : area === "regionals"
                                      ? supabaseClient
                                          .from("frcdle_regionals")
                                          .select("*")
                                      : null);

      const mainCache = mainResponse?.data;
      const dbError = mainResponse?.error;

      if (dbError) {
        throw dbError;
      }

      console.log("used db");
      return res.status(200).json(mainCache);
    } catch (error: any) {
      console.error(error);
      throw error;
      // return res.status(error.status);
    }
  }
};

export const test = async (
  req: Request<MultiTeamFetchParams>,
  res: Response,
): Promise<Response> => {
  try {
    const area = req.query.district;
    console.log(area);

    if (!area) {
      return res.status(400).json({ error: "Please input an area parameter." });
    }

    const mainResponse = await (area === "all"
      ? supabaseClient.from("frcdle_all").select("*")
      : area === "ca"
        ? supabaseClient.from("frcdle_ca").select("*")
        : area === "fch"
          ? supabaseClient.from("frcdle_fch").select("*")
          : area === "fim"
            ? supabaseClient.from("frcdle_fim").select("*")
            : area === "fin"
              ? supabaseClient.from("frcdle_fin").select("*")
              : area === "fit"
                ? supabaseClient.from("frcdle_fit").select("*")
                : area === "fma"
                  ? supabaseClient.from("frcdle_fma").select("*")
                  : area === "fnc"
                    ? supabaseClient.from("frcdle_fnc").select("*")
                    : area === "fsc"
                      ? supabaseClient.from("frcdle_fsc").select("*")
                      : area === "isr"
                        ? supabaseClient.from("frcdle_isr").select("*")
                        : area === "ne"
                          ? supabaseClient.from("frcdle_ne").select("*")
                          : area === "ont"
                            ? supabaseClient.from("frcdle_ont").select("*")
                            : area === "pch"
                              ? supabaseClient.from("frcdle_pch").select("*")
                              : area === "pnw"
                                ? supabaseClient.from("frcdle_pnw").select("*")
                                : area === "win"
                                  ? supabaseClient
                                      .from("frcdle_win")
                                      .select("*")
                                  : area === "regionals"
                                    ? supabaseClient
                                        .from("frcdle_regionals")
                                        .select("*")
                                    : null);

    const mainCache = mainResponse?.data;
    const dbError = mainResponse?.error;
    // console.log(response);

    if (dbError) {
      throw dbError;
    }

    const ONE_DAY = 24 * 60 * 60 * 1000;
    const timeNow = Date.now();

    const dataStale =
      mainCache!.length === 0 ||
      timeNow - new Date(mainCache![0]?.timestamp).getTime() > ONE_DAY;

    if (dataStale) {
      try {
        if (area === "regionals") {
          const response1 = await fetch(
            "https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings",
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response1.ok) {
            throw new Error(
              `The TBA API responded with status code ${response1.status}`,
            );
          }

          const data1 = (await response1.json()) as TBAAreaData[];
          const data1_ = data1.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          let offset = 0;
          let regionalTeams: StatboticsTeamYearData[] = [];
          let curPulledTeams: StatboticsTeamYearData[];
          do {
            const response2 =
              offset == 0
                ? await fetch(
                    "https://api.statbotics.io/v3/team_years?year=2026",
                    {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                      },
                    },
                  )
                : await fetch(
                    `https://api.statbotics.io/v3/team_years?year=2026&offset=${offset}`,
                    {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                      },
                    },
                  );
            if (!response2.ok) {
              throw new Error(
                `The Statbotics API responded with status code: ${response2.status}`,
              );
            }
            curPulledTeams =
              (await response2.json()) as StatboticsTeamYearData[];
            regionalTeams =
              offset == 0
                ? curPulledTeams
                : [...regionalTeams, ...curPulledTeams];
            offset += 1000;
          } while (curPulledTeams.length >= 1000);

          const data2 = [];
          for (let i = 0; i < regionalTeams.length; i++) {
            if (
              !regionalTeams[i].district &&
              regionalTeams[i].record.count !== 0 &&
              !regionalTeams[i].name.includes("Off-Season Demo Team")
            ) {
              data2.push({
                teamNum: regionalTeams[i].team,
                teamName: regionalTeams[i].name,
                rookieYear: regionalTeams[i].rookie_year,
                unitlessEPA: regionalTeams[i].epa.unitless,
                epaRank: regionalTeams[i].epa.ranks.district.rank,
                worldEPARank: regionalTeams[i].epa.ranks.total.rank,
                totalNumTeams: regionalTeams[i].epa.ranks.district.team_count,
              });
            }
          }

          const returnableData = [];
          for (let i = 0; i < data2.length; i++) {
            returnableData.push({
              teamNum: data2[i].teamNum,
              teamName: data2[i].teamName,
              rookieYear: data2[i].rookieYear,
              unitlessEPA: data2[i].unitlessEPA,
              epaRank: data2[i].epaRank,
              worldEPARank: data2[i].worldEPARank,
              areaRank: data1_[i].rank,
              totalNumTeams: data2[i].totalNumTeams,
            });
          }

          const { data: updated, error: upsertError } = await supabaseAdmin
            .from("frcdle_regionals")
            .upsert(returnableData);

          if (upsertError) {
            throw upsertError;
          }

          return res.status(200).json(updated);
        } else if (area === "all") {
          //regionals
          const response1Regional = await fetch(
            "https://www.thebluealliance.com/api/v3/regional_advancement/2026/rankings",
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response1Regional.ok) {
            throw new Error(
              `The TBA API responded with status code ${response1Regional.status}`,
            );
          }

          const data1Regional =
            (await response1Regional.json()) as TBAAreaData[];
          const data1Regional_ = data1Regional.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          let offset = 0;
          let regionalTeams: StatboticsTeamYearData[] = [];
          let curPulledTeams: StatboticsTeamYearData[];
          do {
            const response2Regional =
              offset == 0
                ? await fetch(
                    "https://api.statbotics.io/v3/team_years?year=2026",
                    {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                      },
                    },
                  )
                : await fetch(
                    `https://api.statbotics.io/v3/team_years?year=2026&offset=${offset}`,
                    {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                      },
                    },
                  );
            if (!response2Regional.ok) {
              throw new Error(
                `The Statbotics API responded with status code: ${response2Regional.status}`,
              );
            }
            curPulledTeams =
              (await response2Regional.json()) as StatboticsTeamYearData[];
            regionalTeams =
              offset == 0
                ? curPulledTeams
                : [...regionalTeams, ...curPulledTeams];
            offset += 1000;
          } while (curPulledTeams.length >= 1000);

          const data2Regional = [];
          for (let i = 0; i < regionalTeams.length; i++) {
            if (
              !regionalTeams[i].district &&
              regionalTeams[i].record.count !== 0 &&
              !regionalTeams[i].name.includes("Off-Season Demo Team")
            ) {
              data2Regional.push({
                teamNum: regionalTeams[i].team,
                teamName: regionalTeams[i].name,
                rookieYear: regionalTeams[i].rookie_year,
                unitlessEPA: regionalTeams[i].epa.unitless,
                epaRank: regionalTeams[i].epa.ranks.district.rank,
                worldEPARank: regionalTeams[i].epa.ranks.total.rank,
                totalNumTeams: regionalTeams[i].epa.ranks.district.team_count,
              });
            }
          }

          const regionalData = [];
          for (let i = 0; i < data2Regional.length; i++) {
            regionalData.push({
              teamNum: data2Regional[i].teamNum,
              teamName: data2Regional[i].teamName,
              rookieYear: data2Regional[i].rookieYear,
              unitlessEPA: data2Regional[i].unitlessEPA,
              epaRank: data2Regional[i].epaRank,
              worldEPARank: data2Regional[i].worldEPARank,
              areaRank: data1Regional_[i].rank,
              totalNumTeams: data2Regional[i].totalNumTeams,
            });
          }

          const response1ca = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=ca`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1ca.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1ca.status}`,
            );
          }

          const data1ca =
            (await response1ca.json()) as StatboticsTeamYearData[];

          const response2ca = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026ca/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2ca.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2ca.status}`,
            );
          }

          const data2ca = (await response2ca.json()) as TBAAreaData[];
          const data2ca_ = data2ca.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const caData = [];
          for (let i = 0; i < data1ca.length; i++) {
            caData.push({
              teamNum: data1ca[i].team,
              teamName: data1ca[i].name,
              rookieYear: data1ca[i].rookie_year,
              unitlessEPA: data1ca[i].epa.unitless,
              epaRank: data1ca[i].epa.ranks.district.rank,
              worldEPARank: data1ca[i].epa.ranks.total.rank,
              areaRank: data2ca_[i].rank,
            });
          }

          const response1fch = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fch`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fch.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fch.status}`,
            );
          }

          const data1fch =
            (await response1fch.json()) as StatboticsTeamYearData[];

          const response2fch = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fch/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fch.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fch.status}`,
            );
          }

          const data2fch = (await response2fch.json()) as TBAAreaData[];
          const data2fch_ = data2fch.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fchData = [];
          for (let i = 0; i < data1fch.length; i++) {
            fchData.push({
              teamNum: data1fch[i].team,
              teamName: data1fch[i].name,
              rookieYear: data1fch[i].rookie_year,
              unitlessEPA: data1fch[i].epa.unitless,
              epaRank: data1fch[i].epa.ranks.district.rank,
              worldEPARank: data1fch[i].epa.ranks.total.rank,
              areaRank: data2fch_[i].rank,
            });
          }

          const response1fim = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fim`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fim.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fim.status}`,
            );
          }

          const data1fim =
            (await response1fim.json()) as StatboticsTeamYearData[];

          const response2fim = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fim/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fim.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fim.status}`,
            );
          }

          const data2fim = (await response2fim.json()) as TBAAreaData[];
          const data2fim_ = data2fim.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fimData = [];
          for (let i = 0; i < data1fim.length; i++) {
            fimData.push({
              teamNum: data1fim[i].team,
              teamName: data1fim[i].name,
              rookieYear: data1fim[i].rookie_year,
              unitlessEPA: data1fim[i].epa.unitless,
              epaRank: data1fim[i].epa.ranks.district.rank,
              worldEPARank: data1fim[i].epa.ranks.total.rank,
              areaRank: data2fim_[i].rank,
            });
          }

          const response1fin = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fin`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fin.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fin.status}`,
            );
          }

          const data1fin =
            (await response1fin.json()) as StatboticsTeamYearData[];

          const response2fin = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fin/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fin.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fin.status}`,
            );
          }

          const data2fin = (await response2fin.json()) as TBAAreaData[];
          const data2fin_ = data2fin.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const finData = [];
          for (let i = 0; i < data1fin.length; i++) {
            finData.push({
              teamNum: data1fin[i].team,
              teamName: data1fin[i].name,
              rookieYear: data1fin[i].rookie_year,
              unitlessEPA: data1fin[i].epa.unitless,
              epaRank: data1fin[i].epa.ranks.district.rank,
              worldEPARank: data1fin[i].epa.ranks.total.rank,
              areaRank: data2fin_[i].rank,
            });
          }

          const response1fit = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fit`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fit.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fit.status}`,
            );
          }

          const data1fit =
            (await response1fit.json()) as StatboticsTeamYearData[];

          const response2fit = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fit/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fit.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fit.status}`,
            );
          }

          const data2fit = (await response2fit.json()) as TBAAreaData[];
          const data2fit_ = data2fit.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fitData = [];
          for (let i = 0; i < data1fit.length; i++) {
            fitData.push({
              teamNum: data1fit[i].team,
              teamName: data1fit[i].name,
              rookieYear: data1fit[i].rookie_year,
              unitlessEPA: data1fit[i].epa.unitless,
              epaRank: data1fit[i].epa.ranks.district.rank,
              worldEPARank: data1fit[i].epa.ranks.total.rank,
              areaRank: data2fit_[i].rank,
            });
          }

          const response1fma = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fma`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fma.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fma.status}`,
            );
          }

          const data1fma =
            (await response1fma.json()) as StatboticsTeamYearData[];

          const response2fma = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fma/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fma.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fma.status}`,
            );
          }

          const data2fma = (await response2fma.json()) as TBAAreaData[];
          const data2fma_ = data2fma.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fmaData = [];
          for (let i = 0; i < data1fma.length; i++) {
            fmaData.push({
              teamNum: data1fma[i].team,
              teamName: data1fma[i].name,
              rookieYear: data1fma[i].rookie_year,
              unitlessEPA: data1fma[i].epa.unitless,
              epaRank: data1fma[i].epa.ranks.district.rank,
              worldEPARank: data1fma[i].epa.ranks.total.rank,
              areaRank: data2fma_[i].rank,
            });
          }

          const response1fnc = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fnc`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fnc.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fnc.status}`,
            );
          }

          const data1fnc =
            (await response1fnc.json()) as StatboticsTeamYearData[];

          const response2fnc = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fnc/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fnc.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fnc.status}`,
            );
          }

          const data2fnc = (await response2fnc.json()) as TBAAreaData[];
          const data2fnc_ = data2fnc.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fncData = [];
          for (let i = 0; i < data1fnc.length; i++) {
            fncData.push({
              teamNum: data1fnc[i].team,
              teamName: data1fnc[i].name,
              rookieYear: data1fnc[i].rookie_year,
              unitlessEPA: data1fnc[i].epa.unitless,
              epaRank: data1fnc[i].epa.ranks.district.rank,
              worldEPARank: data1fnc[i].epa.ranks.total.rank,
              areaRank: data2fnc_[i].rank,
            });
          }

          const response1fsc = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=fsc`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1fsc.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1fsc.status}`,
            );
          }

          const data1fsc =
            (await response1fsc.json()) as StatboticsTeamYearData[];

          const response2fsc = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026fsc/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2fsc.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2fsc.status}`,
            );
          }

          const data2fsc = (await response2fsc.json()) as TBAAreaData[];
          const data2fsc_ = data2fsc.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const fscData = [];
          for (let i = 0; i < data1fsc.length; i++) {
            fscData.push({
              teamNum: data1fsc[i].team,
              teamName: data1fsc[i].name,
              rookieYear: data1fsc[i].rookie_year,
              unitlessEPA: data1fsc[i].epa.unitless,
              epaRank: data1fsc[i].epa.ranks.district.rank,
              worldEPARank: data1fsc[i].epa.ranks.total.rank,
              areaRank: data2fsc_[i].rank,
            });
          }

          const response1isr = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=isr`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1isr.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1isr.status}`,
            );
          }

          const data1isr =
            (await response1isr.json()) as StatboticsTeamYearData[];

          const response2isr = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026isr/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2isr.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2isr.status}`,
            );
          }

          const data2isr = (await response2isr.json()) as TBAAreaData[];
          const data2isr_ = data2isr.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const isrData = [];
          for (let i = 0; i < data1isr.length; i++) {
            isrData.push({
              teamNum: data1isr[i].team,
              teamName: data1isr[i].name,
              rookieYear: data1isr[i].rookie_year,
              unitlessEPA: data1isr[i].epa.unitless,
              epaRank: data1isr[i].epa.ranks.district.rank,
              worldEPARank: data1isr[i].epa.ranks.total.rank,
              areaRank: data2isr_[i].rank,
            });
          }

          const response1ne = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=ne`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1ne.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1ne.status}`,
            );
          }

          const data1ne =
            (await response1ne.json()) as StatboticsTeamYearData[];

          const response2ne = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026ne/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2ne.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2ne.status}`,
            );
          }

          const data2ne = (await response2ne.json()) as TBAAreaData[];
          const data2ne_ = data2ne.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const neData = [];
          for (let i = 0; i < data1ne.length; i++) {
            neData.push({
              teamNum: data1ne[i].team,
              teamName: data1ne[i].name,
              rookieYear: data1ne[i].rookie_year,
              unitlessEPA: data1ne[i].epa.unitless,
              epaRank: data1ne[i].epa.ranks.district.rank,
              worldEPARank: data1ne[i].epa.ranks.total.rank,
              areaRank: data2ne_[i].rank,
            });
          }

          const response1ont = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=ont`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1ont.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1ont.status}`,
            );
          }

          const data1ont =
            (await response1ont.json()) as StatboticsTeamYearData[];

          const response2ont = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026ont/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2ont.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2ont.status}`,
            );
          }

          const data2ont = (await response2ont.json()) as TBAAreaData[];
          const data2ont_ = data2ont.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const ontData = [];
          for (let i = 0; i < data1ont.length; i++) {
            ontData.push({
              teamNum: data1ont[i].team,
              teamName: data1ont[i].name,
              rookieYear: data1ont[i].rookie_year,
              unitlessEPA: data1ont[i].epa.unitless,
              epaRank: data1ont[i].epa.ranks.district.rank,
              worldEPARank: data1ont[i].epa.ranks.total.rank,
              areaRank: data2ont_[i].rank,
            });
          }

          const response1pch = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=pch`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1pch.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1pch.status}`,
            );
          }

          const data1pch =
            (await response1pch.json()) as StatboticsTeamYearData[];

          const response2pch = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026${area}/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2pch.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2pch.status}`,
            );
          }

          const data2pch = (await response2pch.json()) as TBAAreaData[];
          const data2pch_ = data2pch.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const pchData = [];
          for (let i = 0; i < data1pch.length; i++) {
            pchData.push({
              teamNum: data1pch[i].team,
              teamName: data1pch[i].name,
              rookieYear: data1pch[i].rookie_year,
              unitlessEPA: data1pch[i].epa.unitless,
              epaRank: data1pch[i].epa.ranks.district.rank,
              worldEPARank: data1pch[i].epa.ranks.total.rank,
              areaRank: data2pch_[i].rank,
            });
          }

          const response1pnw = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=pnw`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1pnw.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1pnw.status}`,
            );
          }

          const data1pnw =
            (await response1pnw.json()) as StatboticsTeamYearData[];

          const response2pnw = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026pnw/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2pnw.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2pnw.status}`,
            );
          }

          const data2pnw = (await response2pnw.json()) as TBAAreaData[];
          const data2pnw_ = data2pnw.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const pnwData = [];
          for (let i = 0; i < data1pnw.length; i++) {
            pnwData.push({
              teamNum: data1pnw[i].team,
              teamName: data1pnw[i].name,
              rookieYear: data1pnw[i].rookie_year,
              unitlessEPA: data1pnw[i].epa.unitless,
              epaRank: data1pnw[i].epa.ranks.district.rank,
              worldEPARank: data1pnw[i].epa.ranks.total.rank,
              areaRank: data2pnw_[i].rank,
            });
          }

          const response1win = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=win`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1win.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1win.status}`,
            );
          }

          const data1win =
            (await response1win.json()) as StatboticsTeamYearData[];

          const response2win = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026win/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2win.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2win.status}`,
            );
          }

          const data2win = (await response2win.json()) as TBAAreaData[];
          const data2win_ = data2win.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const winData = [];
          for (let i = 0; i < data1win.length; i++) {
            winData.push({
              teamNum: data1win[i].team,
              teamName: data1win[i].name,
              rookieYear: data1win[i].rookie_year,
              unitlessEPA: data1win[i].epa.unitless,
              epaRank: data1win[i].epa.ranks.district.rank,
              worldEPARank: data1win[i].epa.ranks.total.rank,
              areaRank: data2win_[i].rank,
            });
          }

          const finalData = [
            ...caData,
            ...fchData,
            ...fimData,
            ...finData,
            ...fitData,
            ...fmaData,
            ...fncData,
            ...fscData,
            ...isrData,
            ...neData,
            ...ontData,
            ...pchData,
            ...pnwData,
            ...winData,
            ...regionalData,
          ];

          const updatedResponse = await supabaseAdmin
            .from("frcdle_all")
            .upsert(finalData);

          const updatedData = updatedResponse?.data;
          const upsertError = updatedResponse?.error;
          if (upsertError) {
            // console.error(upsertError);
            throw upsertError;
          }
          return res.status(200).json(updatedData);
        } else {
          //For everything except area rank
          const response1 = await fetch(
            `https://api.statbotics.io/v3/team_years?year=2026&district=${area}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            },
          );

          if (!response1.ok) {
            throw new Error(
              `The Statbotics API responded with status code: ${response1.status}`,
            );
          }

          const data1 = (await response1.json()) as StatboticsTeamYearData[];

          const response2 = await fetch(
            `https://www.thebluealliance.com/api/v3/district/2026${area}/rankings`,
            {
              method: "GET",
              headers: {
                "X-TBA-Auth-Key": process.env.TBA_AUTH_KEY || "",
                accept: "application/json",
              },
            },
          );

          if (!response2.ok) {
            throw new Error(
              `The TBA API responded with status code ${response2.status}`,
            );
          }

          const data2 = (await response2.json()) as TBAAreaData[];
          const data2_ = data2.sort(
            (a, b) =>
              parseInt(a.team_key.replace(/\D/g, "")) -
              parseInt(b.team_key.replace(/\D/g, "")),
          );

          const returnableData = [];
          for (let i = 0; i < data1.length; i++) {
            returnableData.push({
              teamNum: data1[i].team,
              teamName: data1[i].name,
              rookieYear: data1[i].rookie_year,
              unitlessEPA: data1[i].epa.unitless,
              epaRank: data1[i].epa.ranks.district.rank,
              worldEPARank: data1[i].epa.ranks.total.rank,
              areaRank: data2_[i].rank,
            });
          }

          // const { data: updated, error: upsertError } = await supabaseAdmin
          //   .from("frcdle_regionals")
          //   .upsert({ ...returnableData, timestamp: new Date().toISOString() });

          // const upsertableItems = returnableData.map()

          const updatedResponse = await (area === "all"
            ? supabaseAdmin.from("frcdle_all").upsert(returnableData)
            : area === "ca"
              ? supabaseAdmin.from("frcdle_ca").upsert(returnableData)
              : area === "fch"
                ? supabaseAdmin.from("frcdle_fch").upsert(returnableData)
                : area === "fim"
                  ? supabaseAdmin.from("frcdle_fim").upsert(returnableData)
                  : area === "fin"
                    ? supabaseAdmin.from("frcdle_fin").upsert(returnableData)
                    : area === "fit"
                      ? supabaseAdmin.from("frcdle_fit").upsert(returnableData)
                      : area === "fma"
                        ? supabaseAdmin
                            .from("frcdle_fma")
                            .upsert(returnableData)
                        : area === "fnc"
                          ? supabaseAdmin
                              .from("frcdle_fnc")
                              .upsert(returnableData)
                          : area === "fsc"
                            ? supabaseAdmin
                                .from("frcdle_fsc")
                                .upsert(returnableData)
                            : area === "isr"
                              ? supabaseAdmin
                                  .from("frcdle_isr")
                                  .upsert(returnableData)
                              : area === "ne"
                                ? supabaseAdmin
                                    .from("frcdle_ne")
                                    .upsert(returnableData)
                                : area === "ont"
                                  ? supabaseAdmin
                                      .from("frcdle_ont")
                                      .upsert(returnableData)
                                  : area === "pch"
                                    ? supabaseAdmin
                                        .from("frcdle_pch")
                                        .upsert(returnableData)
                                    : area === "pnw"
                                      ? supabaseAdmin
                                          .from("frcdle_pnw")
                                          .upsert(returnableData)
                                      : area === "win"
                                        ? supabaseAdmin
                                            .from("frcdle_win")
                                            .upsert(returnableData)
                                        : null);

          const updatedData = updatedResponse?.data;
          const upsertError = updatedResponse?.error;
          if (upsertError) {
            // console.error(upsertError);
            throw upsertError;
          }

          return res.status(200).json(updatedData);
        }
      } catch (error: any) {
        console.error(error);
        return res
          .status(500)
          .json({ error: "There was an issue with the server." });
      }
    }

    return res.status(200).json(mainCache);
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "There was an issue with the server." });
  }
};
