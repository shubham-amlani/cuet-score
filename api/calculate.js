import axios from "axios";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const answerKeys = {
  "General Management": {
    43244918548: "43244972702",
    43244918549: "43244972705",
    43244918550: "43244972709",
    43244918551: "43244972713",
    43244918552: "43244972718",
    43244918553: "43244972721",
    43244918554: "43244972725",
    43244918555: "43244972729",
    43244918556: "43244972735",
    43244918557: "43244972737",
    43244918558: "43244972743",
    43244918559: "43244972748",
    43244918560: "43244972749",
    43244918561: "43244972755",
    43244918562: "43244972757",
    43244918563: "43244972762",
    43244918564: "43244972768",
    43244918565: "43244972771",
    43244918566: "43244972775",
    43244918567: "43244972777",
    43244918568: "43244972781",
    43244918569: "43244972787",
    43244918570: "43244972791",
    43244918571: "43244972796",
    43244918572: "43244972799",
    43244918573: "43244972801",
    43244918574: "43244972806",
    43244918575: "43244972810",
    43244918576: "43244972815",
    43244918577: "43244972817",
    43244918578: "43244972823",
    43244918579: "43244972825",
    43244918580: "43244972831",
    43244918581: "43244972836",
    43244918582: "43244972837",
    43244918583: "43244972844",
    43244918584: "43244972846",
    43244918585: "43244972852",
    43244918586: "43244972854",
    43244918587: "43244972860",
    43244918588: "43244972863",
    43244918589: "43244972868",
    43244918590: "43244972872",
    43244918591: "43244972874",
    43244918592: "43244972879",
    43244918593: "43244972881",
    43244918594: "43244972886",
    43244918595: "43244972892",
    43244918596: "43244972895",
    43244918597: "43244972897",
    43244918598: "43244972901",
    43244918599: "43244972906",
    43244918600: "43244972911",
    43244918601: "43244972914",
    43244918602: "43244972918",
    43244918603: "43244972921",
    43244918604: "43244972926",
    43244918605: "43244972930",
    43244918606: "43244972934",
    43244918607: "43244972939",
    43244918608: "43244972944",
    43244918609: "43244972948",
    43244918610: "43244972951",
    43244918611: "43244972953",
    43244918612: "43244972959",
    43244918613: "43244972961",
    43244918614: "43244972968",
    43244918615: "43244972971",
    43244918616: "43244972974",
    43244918617: "43244972978",
    43244918618: "43244972983",
    43244918619: "43244972987",
    43244918620: "43244972990",
    43244918621: "43244972996",
    43244918622: "43244973000",
  },
  "Computer Science and Information Technology": {
    43244927278: "432449107502",
    43244927279: "432449107507",
    43244927280: "432449107512",
    43244927281: "432449107516",
    43244927282: "432449107518",
    43244927283: "432449107522",
    43244927284: "432449107526",
    43244927285: "432449107530",
    43244927286: "432449107535",
    43244927287: "432449107537",
    43244927288: "432449107541",
    43244927289: "432449107546",
    43244927290: "432449107552",
    43244927291: "432449107553",
    43244927292: "432449107560",
    43244927293: "432449107561",
    43244927294: "432449107567",
    43244927295: "432449107572",
    43244927296: "432449107574",
    43244927297: "432449107578",
    43244927298: "432449107581",
    43244927299: "432449107586",
    43244937300: "432449107589",
    43244927301: "432449107593",
    43244927302: "432449107599",
    43244927303: "432449107601",
    43244927304: "432449107608",
    43244927305: "432449107609",
    43244927306: "432449107614",
    43244927307: "432449107618",
    43244927308: "432449107624",
    43244927309: "432449107628",
    43244927310: "432449107630",
    43244927311: "432449107635",
    43244927312: "432449107639",
    43244927313: "432449107643",
    43244927314: "432449107645",
    43244927315: "432449107650",
    43244927316: "432449107654",
    43244927317: "432449107660",
    43244927318: "432449107661",
    43244927319: "432449107668",
    43244927320: "432449107670",
    43244927321: "432449107675",
    43244927322: "432449107678",
    43244927323: "432449107681",
    43244927324: "432449107687",
    43244927325: "432449107692",
    43244927326: "432449107696",
    43244927327: "432449107698",
    43244927328: "432449107702",
    43244927329: "432449107708",
    43244927330: "432449107711",
    43244927331: "432449107716",
    43244927332: "432449107717",
    43244927333: "432449107723",
    43244927334: "432449107728",
    43244927335: "432449107729",
    43244927336: "432449107733",
    43244927337: "432449107738",
    43244927338: "432449107743",
    43244927339: "432449107745",
    43244927340: "432449107750",
    43244927341: "432449107754",
    43244927342: "432449107759",
    43244927343: "432449107762",
    43244927344: "432449107767",
    43244927345: "432449107770",
    43244927346: "432449107775",
    43244927347: "432449107778",
    43244927348: "432449107782",
    43244927349: "432449107785",
    43244927350: "432449107790",
    43244927351: "432449107796",
    43244927352: "432449107798",
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "No URL provided" });

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const extractDetail = (label) => {
      const td = $("td").filter((i, el) => $(el).text().trim() === label);
      return td.length ? td.next().text().trim() : "N/A";
    };

    const candidateData = {
      application_no: extractDetail("Application No"),
      candidate_name: extractDetail("Candidate Name"),
      roll_no: extractDetail("Roll No."),
      test_date: extractDetail("Test Date"),
      subject: extractDetail("Subject"),
    };

    let activeAnswerKey = null;
    let normalizedSubjectName = "";
    const detectedSubject = candidateData.subject
      ? candidateData.subject.toUpperCase()
      : "";

    if (detectedSubject.includes("GENERAL MANAGEMENT")) {
      activeAnswerKey = answerKeys["General Management"];
      normalizedSubjectName = "General Management";
    } else if (
      detectedSubject.includes("COMPUTER SCIENCE") ||
      detectedSubject.includes("INFORMATION TECHNOLOGY")
    ) {
      activeAnswerKey =
        answerKeys["Computer Science and Information Technology"];
      normalizedSubjectName = "Computer Science and Information Technology";
    }

    if (!activeAnswerKey)
      return res
        .status(400)
        .json({ error: `Key for "${candidateData.subject}" not found.` });

    let metrics = {
      attempted: 0,
      unattempted: 0,
      correct: 0,
      incorrect: 0,
      score: 0,
    };

    $(".menu-tbl").each((i, table) => {
      let qId = null,
        status = null,
        chosenOptNum = null;
      let optionsMap = {};

      $(table)
        .find("tr")
        .each((j, row) => {
          const cols = $(row).find("td");
          if (cols.length < 2) return;
          const key = $(cols[0]).text().trim();
          const val = $(cols[1]).text().trim();

          if (key === "Question ID :") qId = val;
          if (key === "Status :") status = val;
          if (key === "Chosen Option :") chosenOptNum = val;
          if (key.includes("Option 1 ID :")) optionsMap["1"] = val;
          if (key.includes("Option 2 ID :")) optionsMap["2"] = val;
          if (key.includes("Option 3 ID :")) optionsMap["3"] = val;
          if (key.includes("Option 4 ID :")) optionsMap["4"] = val;
        });

      if (!qId) return;

      const hasChosenOption =
        chosenOptNum && chosenOptNum !== "--" && chosenOptNum.trim() !== "";

      if (hasChosenOption) {
        metrics.attempted++;
        const chosenOptId = optionsMap[chosenOptNum];
        const correctOptId = activeAnswerKey[qId];

        if (chosenOptId === correctOptId) {
          metrics.correct++;
          metrics.score += 4;
        } else {
          metrics.incorrect++;
          metrics.score -= 1;
        }
      } else {
        metrics.unattempted++;
      }
    });

    let rankInfo = null;
    if (candidateData.application_no !== "N/A") {
      const payload = {
        application_no: candidateData.application_no,
        candidate_name: candidateData.candidate_name,
        roll_no: candidateData.roll_no,
        test_date: candidateData.test_date,
        subject: normalizedSubjectName,
        total_attempted: metrics.attempted,
        total_unattempted: metrics.unattempted,
        total_correct: metrics.correct,
        total_incorrect: metrics.incorrect,
        total_score: metrics.score,
      };

      // 1. Check if the record already exists
      const { data: existingRecord } = await supabase
        .from("cuet_scores")
        .select("id")
        .eq("application_no", candidateData.application_no)
        .eq("subject", normalizedSubjectName)
        .maybeSingle();

      // 2. Explicitly Update or Insert based on the check
      if (existingRecord) {
        const { error: updateError } = await supabase
          .from("cuet_scores")
          .update(payload)
          .eq("id", existingRecord.id);

        if (updateError)
          console.error("Supabase Update Error:", updateError.message);
      } else {
        const { error: insertError } = await supabase
          .from("cuet_scores")
          .insert([payload]);

        if (insertError)
          console.error("Supabase Insert Error:", insertError.message);
      }

      // 3. Rank Logic for CS/IT only (Runs after data is guaranteed stored)
      if (
        normalizedSubjectName === "Computer Science and Information Technology"
      ) {
        const { count: higherCount } = await supabase
          .from("cuet_scores")
          .select("*", { count: "exact", head: true })
          .eq("subject", normalizedSubjectName)
          .gt("total_score", metrics.score);

        const { count: totalCount } = await supabase
          .from("cuet_scores")
          .select("*", { count: "exact", head: true })
          .eq("subject", normalizedSubjectName);

        rankInfo = {
          rank: (higherCount || 0) + 1,
          total: totalCount || 1,
        };
      }
    }

    return res
      .status(200)
      .json({ candidate: candidateData, metrics, rankInfo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error." });
  }
}