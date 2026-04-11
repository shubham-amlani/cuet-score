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

      if (qId && status === "Answered") {
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
      } else if (qId) {
        metrics.unattempted++;
      }
    });

    if (candidateData.application_no !== "N/A") {
      const { data: existingRecord } = await supabase
        .from("cuet_scores")
        .select("id")
        .eq("application_no", candidateData.application_no)
        .eq("subject", normalizedSubjectName)
        .maybeSingle();

      if (!existingRecord) {
        await supabase.from("cuet_scores").insert([
          {
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
          },
        ]);
      }
    }

    return res.status(200).json({ candidate: candidateData, metrics: metrics });
  } catch (error) {
    return res.status(500).json({ error: "Server Error during calculation." });
  }
}
