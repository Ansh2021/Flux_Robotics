import { Request, Response } from "express";

export const getFRCWordleData = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// interface TBATeamData {
//   teamName: string;
//   rookieYear: number;
//   numYearsParticipated: number;
//   awardNum: number;
// }

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
  district_points: number;
  district_rank: number;
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

    //for unitless epa and epa rank
    const response5 = await fetch(
      `https://api.statbotics.io/v3/team_year/${teamNum}/2026
`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      },
    );

    if (!response5.ok) {
      throw new Error(
        `The Statbotics API responded with status code ${response5.status}`,
      );
    }

    const data5 = (await response5.json()) as StatboticsTeamYearData;

    //final, returnable data
    const returnData = {
      teamNum: teamNum,
      teamName: data1.nickname,
      area: data4_,
      rookieYear: data1.rookie_year,
      numYearsParticipating: data3.length,
      unitlessEPA: data5.epa.unitless,
      epaRank: data5.epa.ranks.district.rank,
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
        curPulledTeams = await response2.json();
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
          areaRank: data1_[i].rank,
        });
      }

      return res.status(200).json(returnableData);
    } else if (area === "all") {
      let offset = 0;
      let regionalTeams: StatboticsTeamYearData[] = [];
      let curPulledTeams: StatboticsTeamYearData[];
      do {
        const response =
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
        if (!response.ok) {
          throw new Error(
            `The Statbotics API responded with status code: ${response.status}`,
          );
        }
        curPulledTeams = await response.json();
        regionalTeams =
          offset == 0 ? curPulledTeams : [...regionalTeams, ...curPulledTeams];
        offset += 1000;
      } while (curPulledTeams.length >= 1000);

      const data = [];
      for (let i = 0; i < regionalTeams.length; i++) {
        if (!regionalTeams[i].district && regionalTeams[i].record.count !== 0) {
          data.push({
            teamNum: regionalTeams[i].team,
            teamName: regionalTeams[i].name,
            rookieYear: regionalTeams[i].rookie_year,
            unitlessEPA: regionalTeams[i].epa.unitless,
            epaRank: regionalTeams[i].epa.ranks.district,
          });
        }
      }

      console.log(data.length);
      console.log(data);
      //TODO: make this return statement actually return something
      return res.status(400);
    } else {
      //For team num, team name, rookie year
      const response1 = await fetch(
        `https://www.thebluealliance.com/api/v3/district/2026${area}/teams
`,
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

      const data1 = (await response1.json()) as TBATeamData[];
      const data1_ = data1.sort((a, b) => a.team_number - b.team_number);

      // console.log(data1_);

      return res.status(200).json(data1_);
    }
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "There was an issue with the server." });
  }
};

// export const getAllAreaTeamData = async (
//   req: Request<MultiTeamFetchParams>,
//   res: Response,
// ): Promise<Response> => {
//   const area = req.query.district;
//   console.log(area);

//   if (!area) {
//     return res.status(400).json({ error: "Please input an area parameter." });
//   }
// };
