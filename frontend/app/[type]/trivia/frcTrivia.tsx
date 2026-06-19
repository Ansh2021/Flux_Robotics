import { useEffect, useState, useRef } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Bounce, toast } from "react-toastify";

//Filtering options for questions
//Core Category (general FIRST knowledge, events, awards, teams)
//Era (historical, current, upcoming)
//Difficulty (easy, medium, hard)
//Answer Type (MCQ, FRQ, True/False)

interface QuestionData {
  question: string;
  answers: string;
  core_category: string;
  era: string;
  difficulty: string;
  answer_type: string;
}

//TODO: when questions are filtered, count the amount of filtered questions available
export default function FRCTrivia() {
  const [triviaModalVisible, setTriviaModalVisible] = useState(false);

  const [questionsVisible, setQuestionsVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    ((typeof categories)[number] | null)[]
  >([]);
  const [selectedEra, setSelectedEra] = useState<
    ((typeof eras)[number] | null)[]
  >([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ((typeof difficulties)[number] | null)[]
  >([]);
  const [selectedAnswerType, setSelectedAnswerType] = useState<
    ((typeof answerTypes)[number] | null)[]
  >([]);

  const [questionData, setQuestionData] = useState<QuestionData[]>([]);
  const [randomQuestion, setRandomQuestion] = useState<QuestionData>();

  const [fetchQuestionData, setFetchQuestionData] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setTriviaModalVisible(true);
    }, 1000);
  }, []);

  useEffect(() => {
    async function getQuestionData() {
      const urlParams = new URLSearchParams();

      selectedCategory.forEach((category) =>
        urlParams.append("category", category.cat),
      );
      selectedEra.forEach((era) => urlParams.append("era", era.period));
      selectedDifficulty.forEach((difficulty) =>
        urlParams.append("difficulty", difficulty.diff),
      );
      selectedAnswerType.forEach((answerType) =>
        urlParams.append("answerType", answerType.type),
      );
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/frc/trivia/get-questions/?${urlParams.toString()}`,
        );
        console.log(
          `${process.env.NEXT_PUBLIC_API_URL}/frc/trivia/get-questions/?${urlParams.toString()}`,
        );

        if (!res.ok) {
          throw new Error(`Error Status: ${res.status}`);
        }

        const data = (await res.json()) as QuestionData[];
        setQuestionData(data);
        console.log(data);

        setTriviaModalVisible(false);
        setQuestionsVisible(true);
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    }

    if (
      selectedCategory.length > 0 &&
      selectedEra.length > 0 &&
      selectedDifficulty.length > 0 &&
      selectedAnswerType.length > 0
    ) {
      toast.promise(
        getQuestionData(),
        {
          pending: "Fetching questions",
          success: "Questions fetched successfully",
          error: "Failed to fetch questions",
        },
        {
          theme: "dark",
          hideProgressBar: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          transition: Bounce,
          autoClose: 2000,
        },
      );
    }
  }, [fetchQuestionData]);

  useEffect(() => {
    setRandomQuestion(
      questionData[Math.floor(Math.random() * questionData.length)],
    );
  }, [questionData]);

  const insufficientInfo = () => {
    toast.error("Please fill in every field", {
      theme: "dark",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });
  };

  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="h-[calc(100dvh-4rem)] flex flex-col items-center justify-center">
        <FRCTriviaQuestions
          questionsVisible={questionsVisible}
          questionData={randomQuestion}
        />

        <FRCTriviaModal triviaModalVisible={triviaModalVisible}>
          <div className="flex flex-col w-full h-full bg-black justify-center items-center rounded-lg p-10 gap-5">
            <h1 className="font-bold text-2xl">FRC Trivia</h1>
            <FRCTriviaCategoryInput
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            <FRCTriviaEraInput
              selectedEra={selectedEra}
              setSelectedEra={setSelectedEra}
            />

            <FRCTriviaDifficultyInput
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />

            <FRCTriviaAnswerTypeInput
              selectedAnswerType={selectedAnswerType}
              setSelectedAnswerType={setSelectedAnswerType}
            />

            <button
              onClick={() => {
                if (
                  !(
                    selectedCategory.length > 0 &&
                    selectedEra.length > 0 &&
                    selectedDifficulty.length > 0 &&
                    selectedAnswerType.length > 0
                  )
                ) {
                  insufficientInfo();
                  return;
                }

                //TODO: make question data not fetch if user didn't change any question fields
                setFetchQuestionData((prev) => prev + 1);
              }}
              className="group flex rounded-full items-center justify-center h-12 w-30 bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] p-[3px] text-base hover:shadow-lg hover:shadow-[#110e73]/30 transition ease-in-out duration:300"
            >
              <div className="rounded-full bg-black group-hover:bg-[#111111] transition ease-in-out duration:300 h-full w-full flex justify-center items-center group-hover:transition group-hover:ease-in-out group-hover:duration-300">
                Confirm
              </div>
            </button>
          </div>
        </FRCTriviaModal>
      </div>
    </main>
  );
}

const categories = [
  { id: 1, cat: "General" },
  { id: 2, cat: "Events" },
  { id: 3, cat: "Awards" },
  { id: 4, cat: "Team" },
];

export function FRCTriviaCategoryInput({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: ((typeof categories)[number] | null)[];
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<((typeof categories)[number] | null)[]>
  >;
}) {
  const [query, setQuery] = useState("");

  const filteredCategory =
    query === ""
      ? categories
      : categories.filter((category) => {
          return category.cat.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="mx-auto h-screen w-52">
      <Combobox
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        onClose={() => setQuery("")}
        multiple
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            displayValue={(category: (typeof categories)[number] | null) =>
              category?.cat ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              `${selectedCategory.map((category) => category.cat).join(", ")}` ||
              "Question Category"
            }
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[18dvh] max-h-10 no-scrollbar",
          )}
        >
          {filteredCategory.map((category) => (
            <ComboboxOption
              key={category.id}
              value={category}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{category.cat}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

const eras = [
  { id: 1, period: "Historical" },
  { id: 2, period: "Current" },
  { id: 3, period: "Upcoming" },
];

export function FRCTriviaEraInput({
  selectedEra,
  setSelectedEra,
}: {
  selectedEra: ((typeof eras)[number] | null)[];
  setSelectedEra: React.Dispatch<
    React.SetStateAction<((typeof eras)[number] | null)[]>
  >;
}) {
  const [query, setQuery] = useState("");

  const filteredEra =
    query === ""
      ? eras
      : eras.filter((era) => {
          return era.period.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="mx-auto h-screen w-52">
      <Combobox
        value={selectedEra}
        onChange={(value) => setSelectedEra(value)}
        onClose={() => setQuery("")}
        multiple
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            displayValue={(era: (typeof eras)[number] | null) =>
              era?.period ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              `${selectedEra.map((era) => era.period).join(", ")}` ||
              "Question Era"
            }
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[18dvh] max-h-10 no-scrollbar",
          )}
        >
          {filteredEra.map((era) => (
            <ComboboxOption
              key={era.id}
              value={era}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{era.period}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

const difficulties = [
  { id: 1, diff: "Easy" },
  { id: 2, diff: "Medium" },
  { id: 3, diff: "Hard" },
];

export function FRCTriviaDifficultyInput({
  selectedDifficulty,
  setSelectedDifficulty,
}: {
  selectedDifficulty: ((typeof difficulties)[number] | null)[];
  setSelectedDifficulty: React.Dispatch<
    React.SetStateAction<((typeof difficulties)[number] | null)[]>
  >;
}) {
  const [query, setQuery] = useState("");

  const filteredDifficulty =
    query === ""
      ? difficulties
      : difficulties.filter((difficulty) => {
          return difficulty.diff.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="mx-auto h-screen w-52">
      <Combobox
        value={selectedDifficulty}
        onChange={(value) => setSelectedDifficulty(value)}
        onClose={() => setQuery("")}
        multiple
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            displayValue={(difficulty: (typeof difficulties)[number] | null) =>
              difficulty?.diff ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              `${selectedDifficulty.map((difficulty) => difficulty.diff).join(", ")}` ||
              "Question Difficulty"
            }
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[18dvh] max-h-10 no-scrollbar",
          )}
        >
          {filteredDifficulty.map((difficulty) => (
            <ComboboxOption
              key={difficulty.id}
              value={difficulty}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{difficulty.diff}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

const answerTypes = [
  { id: 1, type: "MCQ" },
  { id: 2, type: "FRQ" },
  { id: 3, type: "True/False" },
];

export function FRCTriviaAnswerTypeInput({
  selectedAnswerType,
  setSelectedAnswerType,
}: {
  selectedAnswerType: ((typeof answerTypes)[number] | null)[];
  setSelectedAnswerType: React.Dispatch<
    React.SetStateAction<((typeof answerTypes)[number] | null)[]>
  >;
}) {
  const [query, setQuery] = useState("");

  const filteredAnswerType =
    query === ""
      ? answerTypes
      : answerTypes.filter((answerType) => {
          return answerType.type.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="mx-auto h-screen w-52">
      <Combobox
        value={selectedAnswerType}
        onChange={(value) => setSelectedAnswerType(value)}
        onClose={() => setQuery("")}
        multiple
      >
        <div className="relative">
          <ComboboxInput
            className={clsx(
              "w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-[#0c3c64]",
            )}
            displayValue={(answerType: (typeof answerTypes)[number] | null) =>
              answerType?.type ?? ""
            }
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              `${selectedAnswerType.map((answerType) => answerType.type).join(", ")}` ||
              "Question Answer Type"
            }
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-(--input-width) rounded-xl border border-black bg-[#1E1E1E] p-1 [--anchor-gap:--spacing(1)] empty:invisible",
            "transition duration-100 ease-in data-leave:data-closed:opacity-0 z-2 h-[18dvh] max-h-10 no-scrollbar",
          )}
        >
          {filteredAnswerType.map((answerType) => (
            <ComboboxOption
              key={answerType.id}
              value={answerType}
              className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
            >
              <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
              <div className="text-sm/6 text-white">{answerType.type}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}

function FRCTriviaModal({
  children,
  triviaModalVisible,
}: {
  children: React.ReactNode;
  triviaModalVisible: boolean;
}) {
  return (
    <div
      className={`flex justify-center items-center fixed w-full h-[calc(100dvh-4rem)] transition-colors z-0 ${triviaModalVisible ? "visible bg-black/80" : "invisible"}`}
    >
      <div
        className={`absolute transition-all transition-300 p-[3px] bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] rounded-lg h-[60dvh] w-[60dvw] portrait:min-w-60 portrait:min-h-10 portrait:max-w-100 portrait:max-h-100 landscape:min-h-60 landscape:min-w-10 landscape:max-h-100 landscape:max-w-100 ${triviaModalVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
      >
        {children}
      </div>
    </div>
  );
}

function FRCTriviaQuestions({
  questionsVisible,
  questionData,
}: {
  questionsVisible: boolean;
  questionData: QuestionData;
}) {
  return (
    <div
      className={`absolute p-[3px] bg-linear-to-r from-[#026640] via-[#0c3c64] to-[#151287] rounded-lg h-[80dvh] w-[80dvw] portrait:min-w-60 portrait:min-h-10 portrait:max-w-120 portrait:max-h-120 landscape:min-h-60 landscape:min-w-10 landscape:max-h-120 landscape:max-w-120 ${questionsVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
    >
      <div className="flex flex-col w-full h-full bg-black justify-center items-center rounded-lg p-10 gap-5">
        <div className="flex flex-row w-full justify-center items-center">
          <h1 className="font-bold text-2xl">{questionData?.question}</h1>
        </div>
        <div className="flex flex-col w-full justify-center items-center"></div>
      </div>
    </div>
  );
}
