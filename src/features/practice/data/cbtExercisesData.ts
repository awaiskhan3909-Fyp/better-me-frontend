// Curated CBT Exercises (15 high-impact exercises: 12 across 6 distortions + 3 General CBT foundations)
export interface CBTExerciseQuestion {
  id: number;
  question: string;
  placeholder: string;
  guidance: string;
}

export interface CBTExerciseItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  scenario: string;
  learningTakeaway: string;
  questions: CBTExerciseQuestion[];
}

export interface DistortionCategory {
  id: string;
  name: string;
  description: string;
  themeColor: string;
  bgLight: string;
  borderColor: string;
  iconName: "AlertTriangle" | "Eye" | "Globe" | "Split" | "HeartPulse" | "Compass";
  exercises: CBTExerciseItem[];
}

export const CBT_DISTORTION_CATEGORIES: DistortionCategory[] = [
  {
    id: "catastrophizing",
    name: "Catastrophizing",
    description: "Learn to challenge worst-case scenarios and exaggerated fears.",
    themeColor: "#2a5fb7",
    bgLight: "bg-blue-50/70",
    borderColor: "border-blue-100",
    iconName: "AlertTriangle",
    exercises: [
{
        id: "catastrophizing-1",
        categoryId: "catastrophizing",
        categoryName: "Catastrophizing",
        title: "The Slide Deck Typo Panic",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "During an all-hands team presentation, you noticed a spelling typo on your main financial summary slide. Your heartbeat accelerates, and you immediately think: 'Everyone noticed, my manager thinks I am incompetent, and I am going to get fired.'",
        learningTakeaway: "Catastrophizing blows small imperfections into catastrophic life crises. Separating a small typo from your overall career performance restores rational perspective.",
        questions: [
          {
            id: 1,
            question: "What worst-case thought or assumption are you experiencing?",
            placeholder: "e.g., I believe everyone thinks I'm incompetent and my job is in jeopardy.",
            guidance: "Write down the exact catastrophic prediction your mind jumped to."
          },
          {
            id: 2,
            question: "What concrete evidence supports this catastrophic thought?",
            placeholder: "e.g., There was a typo on slide 4, and someone frowned slightly.",
            guidance: "Stick only to objective, verifiable facts—not feelings or assumptions."
          },
          {
            id: 3,
            question: "What evidence contradicts this worst-case scenario?",
            placeholder: "e.g., I've received praise on past deliverables; nobody mentioned the typo; typos happen to everyone.",
            guidance: "Recall past accomplishments, manager feedback, and how common minor human errors are."
          },
          {
            id: 4,
            question: "What is another, much more likely explanation?",
            placeholder: "e.g., Most people were focused on the numbers, and minor typos are quickly forgotten.",
            guidance: "If a respected colleague made this error, how would you view it?"
          },
          {
            id: 5,
            question: "What would be a balanced, realistic perspective?",
            placeholder: "e.g., Making a minor typo does not erase my competence or hard work. I will fix it on the shared drive and move forward.",
            guidance: "Combine compassion with realistic proportion."
          }
        ]
      },
{
        id: "catastrophizing-3",
        categoryId: "catastrophizing",
        categoryName: "Catastrophizing",
        title: "Medical Symptom Spiral",
        difficulty: "Intermediate",
        estimatedMinutes: 6,
        scenario: "You have had a dull tension headache for two consecutive afternoons after staring at a computer screen. You open a search engine, read about severe neurological conditions, and start preparing for the absolute worst diagnosis.",
        learningTakeaway: "Catastrophic medical anxiety interprets benign bodily sensations as life-threatening emergencies. Reality checks and grounding dissolve the panic.",
        questions: [
          {
            id: 1,
            question: "What catastrophic health prediction are you making?",
            placeholder: "e.g., I think this headache means I have a critical, irreversible disease.",
            guidance: "Acknowledge the fear without judging yourself."
          },
          {
            id: 2,
            question: "What evidence actually supports this diagnosis?",
            placeholder: "e.g., I feel an ache in my temples; Internet search results listed scary conditions.",
            guidance: "Recognize that search engine algorithms prioritize sensational results."
          },
          {
            id: 3,
            question: "What evidence contradicts this scary assumption?",
            placeholder: "e.g., I've slept poorly, stared at screens for 9 hours, and haven't had enough water today.",
            guidance: "List common, everyday triggers for physical tension."
          },
          {
            id: 4,
            question: "What is the most statistically probable explanation?",
            placeholder: "e.g., It's basic eye strain and mild dehydration from prolonged work without a break.",
            guidance: "Occam's razor: the simplest, most common explanation is usually right."
          },
          {
            id: 5,
            question: "What is a sensible, balanced action step instead of panicking?",
            placeholder: "e.g., I will drink two glasses of water, take a walk away from screens, and rest my eyes.",
            guidance: "Formulate a constructive, self-care reframe."
          }
        ]
      }
    ]
  },
  {
    id: "mind-reading",
    name: "Mind Reading",
    description: "Stop assuming you know what others think without real evidence.",
    themeColor: "#7c3aed",
    bgLight: "bg-purple-50/70",
    borderColor: "border-purple-100",
    iconName: "Eye",
    exercises: [
{
        id: "mind-reading-1",
        categoryId: "mind-reading",
        categoryName: "Mind Reading",
        title: "The Abrupt Colleague in the Hallway",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You warmly greeted a coworker in the hallway. They gave a curt nod, looked down at their phone, and walked past without smiling. You think: 'They are annoyed with me and secretly think I'm annoying.'",
        learningTakeaway: "We cannot read minds. Other people's curt reactions are almost always driven by their own internal stress, hurried schedules, or personal problems.",
        questions: [
          {
            id: 1,
            question: "What assumption are you making about their thoughts?",
            placeholder: "e.g., I assume they are angry with me and find me irritating.",
            guidance: "State clearly what mind-reading conclusion you reached."
          },
          {
            id: 2,
            question: "What factual proof do you have that their mood is about you?",
            placeholder: "e.g., Only that they didn't smile or stop to chat like usual.",
            guidance: "Have they actually said anything negative to you?"
          },
          {
            id: 3,
            question: "What evidence suggests this has nothing to do with you?",
            placeholder: "e.g., We had a normal conversation yesterday; I haven't done anything to offend them.",
            guidance: "Think about your recent interactions with this person."
          },
          {
            id: 4,
            question: "What alternative reasons might explain their brief reaction?",
            placeholder: "e.g., They might be late for a client meeting, dealing with personal bad news, or preoccupied.",
            guidance: "Consider their personal workload, stress levels, or focus on their phone."
          },
          {
            id: 5,
            question: "What is a balanced, boundary-respecting perspective?",
            placeholder: "e.g., Their brief greeting reflects their busy day, not their opinion of me. I won't take their mood personally.",
            guidance: "Refuse to take ownership of other people's emotional weather."
          }
        ]
      },
{
        id: "mind-reading-3",
        categoryId: "mind-reading",
        categoryName: "Mind Reading",
        title: "Group Chat Left on Read",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You suggested a weekend outing in a group chat of friends. The message shows 'Seen by 4' but no one replies for three hours. You think: 'Nobody likes my suggestion, and they are probably mocking me in a private chat.'",
        learningTakeaway: "Delayed text replies are the norm in busy adult lives. Mind-reading turns benign timing into an imaginary conspiracy.",
        questions: [
          {
            id: 1,
            question: "What negative narrative are you constructing about your friends?",
            placeholder: "e.g., I assume they think my idea was foolish and are avoiding answering.",
            guidance: "Define the uncharitable assumption."
          },
          {
            id: 2,
            question: "What factual evidence do you have for this conspiracy?",
            placeholder: "e.g., Only the read receipt and the passing of 3 hours on a weekday afternoon.",
            guidance: "Notice that 'seen' only proves the notification was cleared."
          },
          {
            id: 3,
            question: "What evidence shows your friends value you?",
            placeholder: "e.g., They invited me out last week; we often lag in replying to each other's messages.",
            guidance: "Recall your established history of friendship."
          },
          {
            id: 4,
            question: "What practical reasons prevent immediate group responses?",
            placeholder: "e.g., It's a workday afternoon; people wait for someone else to check their calendar first.",
            guidance: "Group dynamics often cause 'bystander hesitation' in replies."
          },
          {
            id: 5,
            question: "What is a healthy, secure perspective to maintain?",
            placeholder: "e.g., People have active lives. An unanswered message is not a rejection of my worth. They will reply when free.",
            guidance: "Reframe with self-assurance and patience."
          }
        ]
      }
    ]
  },
  {
    id: "overgeneralization",
    name: "Overgeneralization",
    description: "Break the habit of treating a single event as a never-ending pattern.",
    themeColor: "#0d9488",
    bgLight: "bg-teal-50/70",
    borderColor: "border-teal-100",
    iconName: "Globe",
    exercises: [
{
        id: "overgeneralization-1",
        categoryId: "overgeneralization",
        categoryName: "Overgeneralization",
        title: "The Unsuccessful Job Interview",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You received a polite automated rejection email after a second-round interview. You immediately think: 'I always fail at interviews. I am never going to find a good job, and nobody will ever hire me.'",
        learningTakeaway: "Notice absolute words like 'always', 'never', and 'nobody'. One rejection is a specific event with specific variables, not a lifetime sentence.",
        questions: [
          {
            id: 1,
            question: "What sweeping, absolute statement are you making?",
            placeholder: "e.g., I always fail at interviews and will never be hired anywhere.",
            guidance: "Underline words like 'always', 'never', 'everyone', or 'nobody'."
          },
          {
            id: 2,
            question: "What factual evidence supports this permanent conclusion?",
            placeholder: "e.g., I was not selected for this specific role at this specific company.",
            guidance: "Limit the scope of the evidence strictly to this single event."
          },
          {
            id: 3,
            question: "What past experiences contradict 'I always fail'?",
            placeholder: "e.g., I was hired in past jobs; I successfully passed the first round here to reach stage two.",
            guidance: "Recall moments where you earned an interview, a contract, or an offer."
          },
          {
            id: 4,
            question: "What external factors influence hiring besides your capability?",
            placeholder: "e.g., Internal promotions, budget shifts, or candidate skill-mix differences.",
            guidance: "Hiring decisions involve dozens of variables outside your control."
          },
          {
            id: 5,
            question: "What is a realistic and motivating reframe?",
            placeholder: "e.g., This one position was not the right match. Rejection is a normal part of the job search, and each interview sharpens my skills.",
            guidance: "Transform a permanent label into a temporary step in the journey."
          }
        ]
      },
{
        id: "overgeneralization-2",
        categoryId: "overgeneralization",
        categoryName: "Overgeneralization",
        title: "The Disappointing First Date",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You met someone for coffee, but the conversation was awkward and there was no romantic spark. On the drive home, you conclude: 'Dating is completely hopeless for me. I will end up completely alone forever.'",
        learningTakeaway: "Chemistry is rare and specific. Concluding you will be 'alone forever' because one stranger wasn't a match is textbook overgeneralization.",
        questions: [
          {
            id: 1,
            question: "What totalizing prediction did you form from this single date?",
            placeholder: "e.g., I will never find a partner and I am doomed to be alone.",
            guidance: "Look for how one date got inflated into an entire lifetime."
          },
          {
            id: 2,
            question: "What does this date actually prove objectively?",
            placeholder: "e.g., That two individual human beings did not have mutual romantic chemistry.",
            guidance: "Does a lack of chemistry prove unworthiness?"
          },
          {
            id: 3,
            question: "What evidence contradicts the idea that you are unlovable?",
            placeholder: "e.g., I have genuine friends, family who care, and have experienced connections in the past.",
            guidance: "Remember your warmth, kindness, and relationship capacity."
          },
          {
            id: 4,
            question: "How many people in the world exist beyond this single individual?",
            placeholder: "e.g., Billions of people with diverse values, preferences, and personalities.",
            guidance: "Put one person's compatibility into mathematical perspective."
          },
          {
            id: 5,
            question: "What is a healthy, optimistic reframe?",
            placeholder: "e.g., Finding the right partner takes time. Discovering this person wasn't a match frees me to meet someone who truly is.",
            guidance: "Reframe incompatibility as valuable clarity."
          }
        ]
      }
    ]
  },
  {
    id: "all-or-nothing",
    name: "All-or-Nothing Thinking",
    description: "Move beyond black-and-white judgements to embrace healthy middle ground.",
    themeColor: "#d97706",
    bgLight: "bg-amber-50/70",
    borderColor: "border-amber-100",
    iconName: "Split",
    exercises: [
{
        id: "all-or-nothing-1",
        categoryId: "all-or-nothing",
        categoryName: "All-or-Nothing Thinking",
        title: "The 92% Exam Score",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You studied intensely for a certification exam and scored 92%. Because you missed a few technical questions and missed a perfect 100%, you tell yourself: 'I either ace it or I am a failure. 92% is worthless.'",
        learningTakeaway: "All-or-nothing thinking eliminates the middle ground. Life exists in the spectrum between 0 and 100, where 92% is an outstanding, passing achievement.",
        questions: [
          {
            id: 1,
            question: "What black-and-white rule are you imposing on yourself?",
            placeholder: "e.g., If I don't achieve 100% perfection, then my score is a complete failure.",
            guidance: "Identify the binary trap (perfection vs. failure)."
          },
          {
            id: 2,
            question: "In what practical world is 92% considered failing?",
            placeholder: "e.g., Nowhere; the passing threshold was 75%, and 92% is an 'A' grade honors mark.",
            guidance: "Look at the objective grading scale and standard requirements."
          },
          {
            id: 3,
            question: "What knowledge and effort did you demonstrate to achieve 92%?",
            placeholder: "e.g., I mastered 92 out of 100 complex concepts and proved strong domain knowledge.",
            guidance: "Celebrate the vast majority of questions you answered accurately."
          },
          {
            id: 4,
            question: "What are the shades of gray between 0% and 100%?",
            placeholder: "e.g., Progress, competence, strong performance, mastery with room for small refinements.",
            guidance: "Replace binary thinking with a continuous continuum."
          },
          {
            id: 5,
            question: "What is a healthy, realistic reframe of your achievement?",
            placeholder: "e.g., 92% is an excellent score that validates my hard work. I passed comfortably, and the few missed questions are just learning opportunities.",
            guidance: "Honor your accomplishment without demanding robotic perfection."
          }
        ]
      },
{
        id: "all-or-nothing-2",
        categoryId: "all-or-nothing",
        categoryName: "All-or-Nothing Thinking",
        title: "The Missed Workout Day",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You committed to a 30-day health routine and completed 18 consecutive days. On day 19, you worked late and missed your gym session. You think: 'My streak is broken, the whole month is ruined, so I might as well quit entirely.'",
        learningTakeaway: "A healthy habit is about consistency, not an unbroken chain. 18 out of 19 days is a 95% success rate, which builds incredible physical momentum.",
        questions: [
          {
            id: 1,
            question: "What 'all-or-nothing' trap is encouraging you to quit?",
            placeholder: "e.g., Believing that missing one day invalidates 18 days of hard work.",
            guidance: "Identify the 'streak or nothing' fallacy."
          },
          {
            id: 2,
            question: "Did your muscles and stamina disappear because of one missed evening?",
            placeholder: "e.g., No, my cardiovascular health and strength gains are fully intact.",
            guidance: "Physiological progress compounds over time, not single days."
          },
          {
            id: 3,
            question: "What is your actual adherence score?",
            placeholder: "e.g., 18 out of 19 days is 94.7% adherence—an elite level of commitment.",
            guidance: "Calculate the real percentage rather than seeing 0 vs 1."
          },
          {
            id: 4,
            question: "What happens if you resume tomorrow instead of giving up?",
            placeholder: "e.g., I finish the month with 29 out of 30 days completed, which is an extraordinary win.",
            guidance: "Focus on recovery speed rather than immaculate streaks."
          },
          {
            id: 5,
            question: "What is a sustainable, resilient perspective?",
            placeholder: "e.g., Missing one workout is just life happening. Consistency beats perfection. I will lace up my shoes tomorrow and continue.",
            guidance: "Adopt the mindset of a lifelong practitioner."
          }
        ]
      }
    ]
  },
  {
    id: "emotional-reasoning",
    name: "Emotional Reasoning",
    description: "Separate emotional feelings from objective reality and factual truths.",
    themeColor: "#e11d48",
    bgLight: "bg-rose-50/70",
    borderColor: "border-rose-100",
    iconName: "HeartPulse",
    exercises: [
{
        id: "emotional-reasoning-1",
        categoryId: "emotional-reasoning",
        categoryName: "Emotional Reasoning",
        title: "Feeling Like an Impostor",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You were recently assigned as lead on a new technical initiative. On Monday morning, you feel an intense wave of self-doubt and nervousness. You conclude: 'Because I feel like a fraud, I must truly be unqualified for this role.'",
        learningTakeaway: "Feelings are not facts. Experiencing nervousness when taking on a new challenge is a normal physiological response to growth, not proof of incompetence.",
        questions: [
          {
            id: 1,
            question: "What emotional sensation are you confusing with objective truth?",
            placeholder: "e.g., I feel like a fraud, so I assume I truly am unqualified.",
            guidance: "Notice how an internal emotion is treated as verified reality."
          },
          {
            id: 2,
            question: "What concrete facts demonstrate your competence?",
            placeholder: "e.g., Leadership chose me based on my past results; I have the required degree and 4 years of experience.",
            guidance: "List credentials, past projects, and external recognitions."
          },
          {
            id: 3,
            question: "Does feeling anxious ever prove that someone is incapable?",
            placeholder: "e.g., No. Top athletes, surgeons, and leaders feel intense pre-performance anxiety.",
            guidance: "Acknowledge that anxiety is energy, not an assessment."
          },
          {
            id: 4,
            question: "Why might a qualified person feel nervous starting a big project?",
            placeholder: "e.g., Because they care deeply about doing a good job and the project is unfamiliar.",
            guidance: "Reframe nervous feelings as a sign of dedication and care."
          },
          {
            id: 5,
            question: "What is a grounded distinction between your feelings and reality?",
            placeholder: "e.g., I feel nervous because this matters to me, but feelings are not facts. I have the skills to lead this project, and I will take it one step at a time.",
            guidance: "Anchor yourself in objective reality while allowing the feeling to pass."
          }
        ]
      },
{
        id: "emotional-reasoning-3",
        categoryId: "emotional-reasoning",
        categoryName: "Emotional Reasoning",
        title: "Guilt Without Wrongdoing",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "A friend was upset because their car broke down. When you declined to cancel your pre-booked doctor appointment to drive them across town, you felt an overwhelming wave of guilt. You conclude: 'I feel guilty, so I must be a selfish, terrible friend.'",
        learningTakeaway: "Guilt often arises simply from setting healthy boundaries, not from wrongdoing. Feeling guilty does not make you selfish.",
        questions: [
          {
            id: 1,
            question: "What character judgment are you making based on your guilt?",
            placeholder: "e.g., I feel bad, so I must be an uncaring and selfish person.",
            guidance: "Notice how guilt is converted into an identity label."
          },
          {
            id: 2,
            question: "Did you actually do anything malicious or dishonest?",
            placeholder: "e.g., No. I had an essential medical appointment, and they were able to call roadside assistance.",
            guidance: "Judge the ethical reality of your action objectively."
          },
          {
            id: 3,
            question: "What evidence shows you are a supportive friend?",
            placeholder: "e.g., I offered to help pay for their ride; I listened supportively; I frequently support them.",
            guidance: "Recall your established loyalty and generosity."
          },
          {
            id: 4,
            question: "Is it healthy or realistic to sacrifice your own medical care?",
            placeholder: "e.g., No. Taking care of my own health is a basic responsibility, not selfishness.",
            guidance: "Distinguish healthy self-care from cruelty."
          },
          {
            id: 5,
            question: "What is a mature, balanced perspective on boundary guilt?",
            placeholder: "e.g., Guilt is an uncomfortable emotion that often appears when I hold necessary boundaries. I can care for my friend without neglecting my own health.",
            guidance: "Hold space for your feelings while upholding your boundaries."
          }
        ]
      }
    ]
  },
  {
    id: "fortune-telling",
    name: "Fortune Telling",
    description: "Question automatic negative predictions about future outcomes.",
    themeColor: "#2563eb",
    bgLight: "bg-indigo-50/70",
    borderColor: "border-indigo-100",
    iconName: "Compass",
    exercises: [
{
        id: "fortune-telling-1",
        categoryId: "fortune-telling",
        categoryName: "Fortune Telling",
        title: "The Upcoming Social Gathering",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You are invited to a networking dinner tomorrow night. 24 hours before the event, you tell yourself: 'I know exactly how it will go. I will freeze up, have nothing smart to say, and make a complete fool of myself.'",
        learningTakeaway: "Fortune telling treats a pessimistic prophecy as an inevitable fate. The future is unwritten, and predicting failure beforehand creates self-fulfilling anxiety.",
        questions: [
          {
            id: 1,
            question: "What negative future prediction are you making as if it's already fact?",
            placeholder: "e.g., I will freeze up, embarrass myself, and regret attending tomorrow.",
            guidance: "Write down the exact crystal-ball prediction."
          },
          {
            id: 2,
            question: "Can you actually see into the future with 100% certainty?",
            placeholder: "e.g., No. Nobody has future sight, and my predictions are just anxious thoughts.",
            guidance: "Acknowledge the difference between an imagination and reality."
          },
          {
            id: 3,
            question: "What evidence from past gatherings contradicts this prediction?",
            placeholder: "e.g., I've had pleasant conversations at past events; usually after 10 minutes I relax.",
            guidance: "Recall social occasions where you felt comfortable or made a friend."
          },
          {
            id: 4,
            question: "What are other possible ways tomorrow night could unfold?",
            placeholder: "e.g., I might meet someone who shares my interests, learn something new, or simply enjoy a nice meal.",
            guidance: "Generate at least two positive or neutral alternative outcomes."
          },
          {
            id: 5,
            question: "What is a constructive, open-minded mindset to bring tomorrow?",
            placeholder: "e.g., I cannot predict the future. I don't need to perform or be the star of the room. I will show up with curiosity and see what happens.",
            guidance: "Trade dread for curiosity."
          }
        ]
      },
{
        id: "fortune-telling-3",
        categoryId: "fortune-telling",
        categoryName: "Fortune Telling",
        title: "The Boundary Conversation",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You need to ask a roommate or coworker to respect shared space cleanliness. You hesitate for days because you tell yourself: 'It's going to turn into a screaming match and our relationship will be permanently destroyed.'",
        learningTakeaway: "Predicting an explosive conflict prevents healthy communication. Most people respond reasonably when approached with calm, respectful clarity.",
        questions: [
          {
            id: 1,
            question: "What catastrophic future reaction are you predicting?",
            placeholder: "e.g., I predict they will get furious, yell at me, and hate me forever.",
            guidance: "Expose the exaggerated conflict scenario."
          },
          {
            id: 2,
            question: "What evidence proves this conversation MUST explode?",
            placeholder: "e.g., None. I am anticipating the worst because confrontation feels uncomfortable.",
            guidance: "Distinguish between your fear of discomfort and actual past precedent."
          },
          {
            id: 3,
            question: "Can the tone of your delivery influence the outcome?",
            placeholder: "e.g., Yes! If I speak calmly, use 'I' statements, and remain polite, they are much more likely to listen.",
            guidance: "Notice how much agency you have over the interaction."
          },
          {
            id: 4,
            question: "What is the cost of avoiding the conversation?",
            placeholder: "e.g., Resentment will build up, the mess will continue, and I will stay stressed daily.",
            guidance: "Recognize that avoidance also creates guaranteed negative outcomes."
          },
          {
            id: 5,
            question: "What is a realistic and proactive perspective?",
            placeholder: "e.g., I cannot control their reaction, but I can control my respectful communication. Calm boundaries solve problems, and it's worth having a quiet, honest chat.",
            guidance: "Step forward with clear, assertive compassion."
          }
        ]
      }
    ]
  },
  {
    id: "general-cbt",
    name: "General CBT",
    description: "Foundational cognitive behavioral protocols for thought records, reality testing, and somatic grounding.",
    themeColor: "#3A7BD5",
    bgLight: "bg-blue-50/70",
    borderColor: "border-blue-100",
    iconName: "Compass",
    exercises: [
      {
        id: "general-thought-record",
        categoryId: "general-cbt",
        categoryName: "General CBT",
        title: "Classic 5-Step Thought Record",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You notice an abrupt surge in anxiety or sadness triggered by an event, email, or passing thought. Learn to systematically identify the trigger, capture the automatic thought, test the evidence, and synthesize an objective balanced reframe.",
        learningTakeaway: "Thought records create a cognitive pause between trigger and reaction, giving you evidence-based control over automatic emotional spikes.",
        questions: [
          {
            id: 1,
            question: "What was the situation or trigger that led to your distressing emotion?",
            placeholder: "e.g., Reading a vague message from my manager right before the weekend.",
            guidance: "Specify the who, what, and when as factual observations without interpreting motives yet."
          },
          {
            id: 2,
            question: "What was the immediate automatic thought that ran through your mind?",
            placeholder: "e.g., I must have made a critical error and I am going to get reprimanded.",
            guidance: "Capture the exact words or worst-case mental headline your brain generated."
          },
          {
            id: 3,
            question: "What objective facts or evidence actually support this automatic thought?",
            placeholder: "e.g., The message was short and asked for a quick sync on Monday.",
            guidance: "List verifiable facts only, leaving out assumptions or feeling-based interpretations."
          },
          {
            id: 4,
            question: "What objective evidence contradicts or challenges this thought?",
            placeholder: "e.g., My last performance review was positive; Monday syncs are routine; managers often send brief notes when busy.",
            guidance: "Consider alternative data, past history, and realistic probabilities."
          },
          {
            id: 5,
            question: "What is a realistic, balanced perspective based on all the facts?",
            placeholder: "e.g., A Monday check-in is routine. Anticipating disaster before hearing what it is about wastes my weekend without changing reality.",
            guidance: "Synthesize both sets of facts into a calm, centered, and proportional perspective."
          }
        ]
      },
      {
        id: "general-behavioral-experiment",
        categoryId: "general-cbt",
        categoryName: "General CBT",
        title: "Belief Testing & Behavioral Experiment",
        difficulty: "Intermediate",
        estimatedMinutes: 7,
        scenario: "You are avoiding an action because your mind predicts a negative outcome (such as speaking up in a team meeting or asking for clarification). Instead of accepting the fearful belief as fact, design a structured micro-experiment to test reality.",
        learningTakeaway: "Behavioral experiments gather firsthand empirical data to disprove anxiety-driven predictions much faster than pure positive thinking.",
        questions: [
          {
            id: 1,
            question: "What negative prediction or belief are you currently holding?",
            placeholder: "e.g., If I ask a clarifying question during the meeting, colleagues will judge me as incompetent.",
            guidance: "Clearly define the exact fear or forecast you want to test."
          },
          {
            id: 2,
            question: "How strongly do you believe this prediction right now (0-100%)?",
            placeholder: "e.g., 85% conviction.",
            guidance: "Rate your baseline emotional certainty before testing."
          },
          {
            id: 3,
            question: "What small, concrete test or action can you take to gather evidence?",
            placeholder: "e.g., Ask one clarifying question during today's standup and observe people's genuine reactions.",
            guidance: "Choose an accessible, low-risk action that directly tests your assumption."
          },
          {
            id: 4,
            question: "What would concrete evidence that disproves your fear look like?",
            placeholder: "e.g., A colleague answers helpfully, someone thanks me for asking, or regular conversation continues calmly.",
            guidance: "Identify specific, objective behavioral signs to observe."
          },
          {
            id: 5,
            question: "After taking action, what was the actual factual outcome compared to the prediction?",
            placeholder: "e.g., Two people chimed in saying they had the exact same question. The predicted judgment never occurred.",
            guidance: "Compare the real-world outcome with your original 85% prediction."
          }
        ]
      },
      {
        id: "general-grounding",
        categoryId: "general-cbt",
        categoryName: "General CBT",
        title: "5-4-3-2-1 Sensory Grounding & Decentering",
        difficulty: "Beginner",
        estimatedMinutes: 4,
        scenario: "Your mind is overwhelmed with racing thoughts and physical tension. Before attempting cognitive reframing, activate your sensory nervous system to down-regulate arousal and return to the present moment.",
        learningTakeaway: "Somatic sensory grounding stabilizes the physiological nervous system so executive functioning and rational reframing can function effectively.",
        questions: [
          {
            id: 1,
            question: "Look around you. Name 5 distinct things you can visually see right now.",
            placeholder: "e.g., Desk lamp, wooden grain, green leaf on plant, notebook, window frame.",
            guidance: "Observe colors, shapes, and fine textures without rushing."
          },
          {
            id: 2,
            question: "Acknowledge 4 things you can physically feel or touch right now.",
            placeholder: "e.g., Soles of feet on the floor, texture of my sleeves, chair supporting my back, warmth of my hands.",
            guidance: "Notice physical points of contact between your body and surroundings."
          },
          {
            id: 3,
            question: "Listen carefully. Name 3 distinct sounds you can hear in your environment.",
            placeholder: "e.g., Quiet hum of air, birds chirping outside, distant street traffic.",
            guidance: "Tune your focus to faint or background acoustic layers."
          },
          {
            id: 4,
            question: "Identify 2 things you can smell (or two favorite calming scents you can visualize).",
            placeholder: "e.g., Morning coffee, clean cotton linen.",
            guidance: "Inhale slowly and engage your olfactory senses."
          },
          {
            id: 5,
            question: "Name 1 taste you can sense or one comforting affirmation you can tell yourself.",
            placeholder: "e.g., Mint from water; 'I am grounded and capable of handling this moment.'",
            guidance: "Anchor yourself with a calming physical sensation or kind phrase."
          }
        ]
      }
    ]
  }
];

export const TOTAL_PRACTICE_EXERCISES = 15;

/**
 * Flat array of all 15 active curated CBT exercises for quick search,
 * filtering, and recommendations.
 */
export const ALL_PRACTICE_EXERCISES: CBTExerciseItem[] = CBT_DISTORTION_CATEGORIES.flatMap(
  (cat) => cat.exercises
);
