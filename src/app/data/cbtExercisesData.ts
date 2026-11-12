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
        id: "catastrophizing-2",
        categoryId: "catastrophizing",
        categoryName: "Catastrophizing",
        title: "The Unreturned Family Call",
        difficulty: "Intermediate",
        estimatedMinutes: 6,
        scenario: "You called a close family member four hours ago when they usually answer within 10 minutes. When your call goes directly to voicemail on the second attempt, your chest tightens with dread that a serious accident has happened.",
        learningTakeaway: "Catastrophic thinking treats an unanswered phone call as an emergency. In reality, mundane explanations (low battery, meetings, driving) account for 99.9% of delays.",
        questions: [
          {
            id: 1,
            question: "What catastrophic outcome is your mind presenting right now?",
            placeholder: "e.g., I assume they were in a car accident or a hospital emergency.",
            guidance: "Identify the disaster movie your brain is creating."
          },
          {
            id: 2,
            question: "What facts actually support this thought right now?",
            placeholder: "e.g., Only that they have not answered their phone for four hours.",
            guidance: "Is there any verified external proof, or only lack of contact?"
          },
          {
            id: 3,
            question: "What evidence makes a terrible disaster improbable?",
            placeholder: "e.g., They are a safe driver; they have silenced their phone before; emergencies are statistically rare.",
            guidance: "Think about how many times this has happened before without any disaster."
          },
          {
            id: 4,
            question: "What are 3 harmless alternative explanations?",
            placeholder: "e.g., Their battery died; they are caught in a meeting; they put their phone on Do Not Disturb.",
            guidance: "Generate plausible, everyday reasons for delayed communication."
          },
          {
            id: 5,
            question: "What is a grounded, rational perspective to hold right now?",
            placeholder: "e.g., A delayed reply is just a delay, not a tragedy. I will occupy myself with my day until they get back to me.",
            guidance: "Calm your nervous system by grounding yourself in the present moment."
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
      },
      {
        id: "catastrophizing-4",
        categoryId: "catastrophizing",
        categoryName: "Catastrophizing",
        title: "The Stumbled Speech Opening",
        difficulty: "Advanced",
        estimatedMinutes: 6,
        scenario: "During the introductory sentence of your speech at a seminar, your voice cracked and you lost your train of thought for 3 seconds. Your mind screams: 'You completely humiliated yourself, everybody is laughing inside, and your reputation is ruined.'",
        learningTakeaway: "A three-second stumble is barely registered by an audience. Catastrophizing magnifies minor friction into irreversible social ruin.",
        questions: [
          {
            id: 1,
            question: "What catastrophic social assumption are you making?",
            placeholder: "e.g., I ruined the entire presentation and everyone lost respect for me.",
            guidance: "Pinpoint the exaggerated social disaster your inner critic created."
          },
          {
            id: 2,
            question: "What evidence supports that your reputation is permanently ruined?",
            placeholder: "e.g., I paused awkwardly and felt flushed for a moment.",
            guidance: "Distinguish between your internal heat/flush and the audience's perception."
          },
          {
            id: 3,
            question: "What evidence shows the speech was far from a total disaster?",
            placeholder: "e.g., I regained my flow, covered all remaining points, and people applauded at the end.",
            guidance: "Look at the remaining 99% of the presentation."
          },
          {
            id: 4,
            question: "How would you view someone else who paused for 3 seconds?",
            placeholder: "e.g., I wouldn't care at all; I would empathize and wait for them to continue.",
            guidance: "Audiences are inherently supportive and want the speaker to succeed."
          },
          {
            id: 5,
            question: "What is a realistic, compassionate reframe?",
            placeholder: "e.g., A brief pause is completely human. The core message was delivered well, and nobody measures my worth by a vocal stumble.",
            guidance: "Create a balanced summary of your courage and delivery."
          }
        ]
      }
    ]
  },
  {
    id: "mind-reading",
    name: "Mind Reading",
    description: "Learn to question assumptions about what other people think.",
    themeColor: "#8b5cf6",
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
        id: "mind-reading-2",
        categoryId: "mind-reading",
        categoryName: "Mind Reading",
        title: "Dinner Table Silence",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "Your partner or friend is uncharacteristically quiet during dinner, gazing out the window and replying with short answers. You immediately interpret: 'They are bored of me and questioning our relationship.'",
        learningTakeaway: "Silence is not criticism. Projecting your own insecurity onto someone else's quiet moment creates unnecessary relationship friction.",
        questions: [
          {
            id: 1,
            question: "What unspoken negative thought are you attributing to them?",
            placeholder: "e.g., I'm assuming they find me dull and regret being with me tonight.",
            guidance: "Write down the imaginary thoughts you put inside their head."
          },
          {
            id: 2,
            question: "What objective evidence supports this belief?",
            placeholder: "e.g., They are looking away and haven't started any conversations.",
            guidance: "Is silence proof of dissatisfaction?"
          },
          {
            id: 3,
            question: "What facts contradict your negative interpretation?",
            placeholder: "e.g., They willingly chose to meet tonight; they were supportive earlier in the day.",
            guidance: "Look at the larger pattern of care and commitment."
          },
          {
            id: 4,
            question: "What internal states might cause someone to be quiet?",
            placeholder: "e.g., Physical exhaustion, mental fatigue from work, or a headache.",
            guidance: "Sometimes people are simply out of social battery."
          },
          {
            id: 5,
            question: "What is a compassionate and realistic response?",
            placeholder: "e.g., Quietness doesn't mean rejection. Instead of mind-reading, I can gently ask: 'How was your day? You seem tired.'",
            guidance: "Replace mind-reading with direct, gentle curiosity."
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
      },
      {
        id: "mind-reading-4",
        categoryId: "mind-reading",
        categoryName: "Mind Reading",
        title: "Walking into the Crowded Room",
        difficulty: "Advanced",
        estimatedMinutes: 6,
        scenario: "You enter a conference hall or party slightly late. A few people turn their heads towards the door. You instantly think: 'They are judging my outfit and thinking I look awkward.'",
        learningTakeaway: "Humans have an automatic visual orienting reflex toward moving doors. Thinking they are judging you is the spotlight effect combined with mind reading.",
        questions: [
          {
            id: 1,
            question: "What thoughts are you assuming the crowd is having about you?",
            placeholder: "e.g., I think they are noticing my flaws and judging my appearance.",
            guidance: "Identify the spotlight effect assumption."
          },
          {
            id: 2,
            question: "What evidence supports that anyone is thinking negatively about you?",
            placeholder: "e.g., A few people glanced in my direction as the door opened.",
            guidance: "Did anyone speak, grimace, or stare critically?"
          },
          {
            id: 3,
            question: "What evidence shows they are preoccupied with their own concerns?",
            placeholder: "e.g., Within 2 seconds everyone turned back to their conversations and drinks.",
            guidance: "Most people are 95% focused on their own appearance and social anxiety."
          },
          {
            id: 4,
            question: "Why do people look at a door when it opens?",
            placeholder: "e.g., It's basic human biological curiosity to check who entered, with zero judgment attached.",
            guidance: "Think about what you do when someone walks into a room."
          },
          {
            id: 5,
            question: "What is a grounded, self-assured perspective?",
            placeholder: "e.g., A quick glance is just natural curiosity, not critique. I belong here just as much as anyone else.",
            guidance: "Step into the space with calm belonging."
          }
        ]
      }
    ]
  },
  {
    id: "overgeneralization",
    name: "Overgeneralization",
    description: "Avoid making broad conclusions from individual negative experiences.",
    themeColor: "#f97316",
    bgLight: "bg-orange-50/70",
    borderColor: "border-orange-100",
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
      },
      {
        id: "overgeneralization-3",
        categoryId: "overgeneralization",
        categoryName: "Overgeneralization",
        title: "The Scorched Dinner Recipe",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "You attempted to cook a new complex pasta sauce for dinner, but turned the heat too high and scorched the bottom. You throw your apron down and exclaim: 'I can't do anything right! I am a total screwup.'",
        learningTakeaway: "An overgeneralized mind turns 'I burned a meal' into 'I can't do anything right'. Confining the mistake to the specific pan prevents self-esteem collapse.",
        questions: [
          {
            id: 1,
            question: "What global self-condemnation are you reciting?",
            placeholder: "e.g., I can never do anything right and I ruin everything I try.",
            guidance: "Identify the leap from a scorched pot to total self-worth."
          },
          {
            id: 2,
            question: "What actually went wrong in objective reality?",
            placeholder: "e.g., The stove temperature was set too high for a 15-minute simmering period.",
            guidance: "Notice that this is a culinary timing mistake, not a character flaw."
          },
          {
            id: 3,
            question: "What are 3 things you have done successfully today or this week?",
            placeholder: "e.g., Completed my tasks at work, paid bills on time, helped a colleague.",
            guidance: "Direct evidence disproving 'I can't do anything right'."
          },
          {
            id: 4,
            question: "How do professional chefs learn new recipes?",
            placeholder: "e.g., By testing, occasionally burning things, adjusting heat, and trying again.",
            guidance: "Mistakes are information for iteration, not identity markers."
          },
          {
            id: 5,
            question: "What is a balanced, patient response to this mishap?",
            placeholder: "e.g., I burned one sauce while trying something new. I can order takeout tonight and use lower heat next time.",
            guidance: "Practice self-kindness over kitchen perfectionism."
          }
        ]
      },
      {
        id: "overgeneralization-4",
        categoryId: "overgeneralization",
        categoryName: "Overgeneralization",
        title: "Rain on Day One of Vacation",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "After planning a beach trip for 3 months, it pours rain on your first morning. Looking out the hotel window, you sigh: 'Every vacation I take is ruined. The universe always curses my time off.'",
        learningTakeaway: "Assigning personal malice to the weather and declaring the entire trip ruined on day one is classic emotional overgeneralization.",
        questions: [
          {
            id: 1,
            question: "What broad statement are you making about your vacations?",
            placeholder: "e.g., I believe all my trips get ruined and luck is always against me.",
            guidance: "Notice the tendency to universalize bad weather."
          },
          {
            id: 2,
            question: "Does rain today guarantee the entire trip is ruined?",
            placeholder: "e.g., No, it's morning on day 1 of a 5-day trip, and the forecast clears tomorrow.",
            guidance: "Separate this morning from the full duration of the holiday."
          },
          {
            id: 3,
            question: "Can you recall positive moments from past trips?",
            placeholder: "e.g., Last year's trip had great sunsets; our mountain hike two years ago was wonderful.",
            guidance: "Memory bias often suppresses good memories when frustrated."
          },
          {
            id: 4,
            question: "What enjoyable activities are possible on a rainy morning?",
            placeholder: "e.g., Relaxing with coffee, reading a book, visiting an indoor museum, or taking a nap.",
            guidance: "Flexibility is the antidote to rigid vacation expectations."
          },
          {
            id: 5,
            question: "What is a constructive, open-minded perspective?",
            placeholder: "e.g., Weather does what it does. Today is a cozy indoor rest day, and there will be plenty of time for sunshine later.",
            guidance: "Embrace the day as it is."
          }
        ]
      }
    ]
  },
  {
    id: "all-or-nothing",
    name: "All-or-Nothing Thinking",
    description: "Learn to recognize situations beyond extreme black-and-white thinking.",
    themeColor: "#3b82f6",
    bgLight: "bg-sky-50/70",
    borderColor: "border-sky-100",
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
      },
      {
        id: "all-or-nothing-3",
        categoryId: "all-or-nothing",
        categoryName: "All-or-Nothing Thinking",
        title: "Critical Feedback on a Design",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You presented a 20-page branding booklet. Your creative director loved the overall visual concept but requested revisions on two typography choices and color balance. You conclude: 'My work is complete garbage. I have no talent.'",
        learningTakeaway: "Receiving targeted edits does not mean the entire creative output is flawed. Constructive feedback is a sign of engagement, not dismissal.",
        questions: [
          {
            id: 1,
            question: "What polarized judgment did you attach to the feedback?",
            placeholder: "e.g., If my draft isn't accepted without changes, then I am completely talentless.",
            guidance: "Expose the unrealistic binary standard."
          },
          {
            id: 2,
            question: "What positive feedback was actually included in their comments?",
            placeholder: "e.g., They praised the overarching visual concept, the layout flow, and the branding clarity.",
            guidance: "Don't let two notes erase eighteen compliments."
          },
          {
            id: 3,
            question: "Is there any professional creative who never receives revisions?",
            placeholder: "e.g., No, every professional designer, author, and architect iterates through drafts.",
            guidance: "Iteration is the core discipline of all craftsmanship."
          },
          {
            id: 4,
            question: "What portion of the booklet was actually questioned?",
            placeholder: "e.g., Roughly 10%—specifically two font choices on two slides.",
            guidance: "Quantify the scope of the edits objectively."
          },
          {
            id: 5,
            question: "What is a professional, growth-oriented perspective?",
            placeholder: "e.g., The core work was strong. Implementing these two revisions will make the project even better, and feedback is how I grow.",
            guidance: "Separate your self-worth from a preliminary draft."
          }
        ]
      },
      {
        id: "all-or-nothing-4",
        categoryId: "all-or-nothing",
        categoryName: "All-or-Nothing Thinking",
        title: "The Birthday Cake Slice",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You've been eating nutritious whole foods for two weeks. At a colleague's farewell party, you had a slice of chocolate cake. You think: 'My diet is ruined. Since I failed today, I might as well binge on fast food for the rest of the week.'",
        learningTakeaway: "A healthy lifestyle accommodates treats. Believing one slice of cake 'ruins everything' triggers unnecessary self-sabotaging binges.",
        questions: [
          {
            id: 1,
            question: "What extreme thinking pattern is driving you to overeat?",
            placeholder: "e.g., Thinking that eating one treat means all healthy progress is erased.",
            guidance: "Identify the 'what-the-hell effect' caused by all-or-nothing thinking."
          },
          {
            id: 2,
            question: "Can 300 calories of cake negate 14 days of balanced nutrition?",
            placeholder: "e.g., No. Scientifically, it's just one meal out of 42 balanced meals over two weeks.",
            guidance: "Look at the biological and caloric reality."
          },
          {
            id: 3,
            question: "If a car has one flat tire, do you slash the other three?",
            placeholder: "e.g., No! You fix the one tire and keep driving.",
            guidance: "Use this analogy to recognize self-sabotaging behavior."
          },
          {
            id: 4,
            question: "How do healthy people relate to celebratory food?",
            placeholder: "e.g., They enjoy a slice with friends and return to their normal nutritious meals next.",
            guidance: "Flexibility and balance are the foundation of long-term health."
          },
          {
            id: 5,
            question: "What is a compassionate, balanced response right now?",
            placeholder: "e.g., I enjoyed a celebratory slice of cake. I don't need to punish myself or binge. My next meal will be balanced and nourishing.",
            guidance: "Step back into balance without guilt."
          }
        ]
      }
    ]
  },
  {
    id: "emotional-reasoning",
    name: "Emotional Reasoning",
    description: "Understand the difference between feelings and objective facts.",
    themeColor: "#ec4899",
    bgLight: "bg-pink-50/70",
    borderColor: "border-pink-100",
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
        id: "emotional-reasoning-2",
        categoryId: "emotional-reasoning",
        categoryName: "Emotional Reasoning",
        title: "Airplane Turbulence Dread",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "While flying, the seatbelt sign chimes and the plane experiences moderate air bumps. Your heart pounds and your palms sweat. You think: 'I feel terrified, so the plane must be in extreme danger of crashing.'",
        learningTakeaway: "Your amygdala's fear response does not change aerodynamics. Airplanes handle turbulence effortlessly every day regardless of passenger fear.",
        questions: [
          {
            id: 1,
            question: "What disaster are you concluding because you feel fear?",
            placeholder: "e.g., I feel terrified, so I believe the plane is about to crash.",
            guidance: "Identify how fear is masquerading as a flight radar."
          },
          {
            id: 2,
            question: "What does modern aviation science say about turbulence?",
            placeholder: "e.g., Turbulence is normal air movement, like waves on water, and commercial aircraft are engineered to withstand forces far beyond it.",
            guidance: "Consult engineering and safety statistics over internal panic."
          },
          {
            id: 3,
            question: "Does your fear level alter the plane's flight path?",
            placeholder: "e.g., Not at all; the plane flies safely on physics, not my emotions.",
            guidance: "Recognize that feelings cannot manipulate physical objects."
          },
          {
            id: 4,
            question: "Look around at the flight attendants. What are they doing?",
            placeholder: "e.g., They are calm, seated, and relaxed because this is routine.",
            guidance: "Use external reality anchors to steady your nervous system."
          },
          {
            id: 5,
            question: "What is a calming, factual mantra for this moment?",
            placeholder: "e.g., Turbulence is uncomfortable, but it is not dangerous. I am safe, the pilots are well-trained, and this feeling will pass.",
            guidance: "Soothe your body with truth."
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
      },
      {
        id: "emotional-reasoning-4",
        categoryId: "emotional-reasoning",
        categoryName: "Emotional Reasoning",
        title: "The Sunday Afternoon Slump",
        difficulty: "Beginner",
        estimatedMinutes: 5,
        scenario: "It is 4:00 PM on a quiet Sunday. You feel a sudden dip in energy, a sense of boredom, and general heaviness. You think: 'I feel unfulfilled right now, which means my whole life has no meaning and I am wasting my years.'",
        learningTakeaway: "Temporary shifts in dopamine and physical fatigue can create an emotional slump. Concluding your life lacks purpose because of a sleepy Sunday is pure emotional reasoning.",
        questions: [
          {
            id: 1,
            question: "What existential conclusion are you drawing from a temporary feeling?",
            placeholder: "e.g., I feel heavy and restless, so my life must be pointless.",
            guidance: "Notice the leap from afternoon lethargy to existential crisis."
          },
          {
            id: 2,
            question: "What biological factors might be causing this low sensation?",
            placeholder: "e.g., Low blood sugar, dehydration, lack of sunlight today, or circadian rhythm dip.",
            guidance: "Rule out basic human physiology first."
          },
          {
            id: 3,
            question: "What areas of your life possess genuine meaning and connection?",
            placeholder: "e.g., My family, my creative hobbies, my values, and my ongoing goals.",
            guidance: "Directly counter the 'no meaning' assumption with reality."
          },
          {
            id: 4,
            question: "Does every Sunday afternoon need to be a thrilling triumph?",
            placeholder: "e.g., No. Downtime and quiet lulls are natural and necessary for rest.",
            guidance: "Normalize restful stillness without pathologizing it."
          },
          {
            id: 5,
            question: "What is a balanced, gentle reframe for this moment?",
            placeholder: "e.g., A low mood on a Sunday is just a transient physical sensation. It says nothing about my life's worth. I will drink some water, stretch, and relax.",
            guidance: "Give yourself permission to just be human."
          }
        ]
      }
    ]
  },
  {
    id: "fortune-telling",
    name: "Fortune Telling",
    description: "Challenge negative predictions about future events.",
    themeColor: "#06b6d4",
    bgLight: "bg-cyan-50/70",
    borderColor: "border-cyan-100",
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
        id: "fortune-telling-2",
        categoryId: "fortune-telling",
        categoryName: "Fortune Telling",
        title: "Learning a Difficult Skill",
        difficulty: "Intermediate",
        estimatedMinutes: 5,
        scenario: "You enrolled in a new professional software or programming course. Looking at the module list on week one, you think: 'I am never going to grasp this advanced stuff. I am guaranteed to fail, so studying is a waste of time.'",
        learningTakeaway: "Predicting failure at the start of a learning curve ignores how neuroplasticity works. Skills feel difficult before they become second nature.",
        questions: [
          {
            id: 1,
            question: "What defeatist future prediction are you convincing yourself of?",
            placeholder: "e.g., I will never understand this material and will inevitably fail the course.",
            guidance: "Identify the pre-emptive surrender."
          },
          {
            id: 2,
            question: "Are you expected to master week 10 material on week 1?",
            placeholder: "e.g., No, education is step-by-step; advanced modules build gradually on basic ones.",
            guidance: "Respect the structured process of learning."
          },
          {
            id: 3,
            question: "What difficult skills have you mastered in the past that once felt foreign?",
            placeholder: "e.g., Learning to drive, learning my current job software, learning a second language.",
            guidance: "Remind yourself of your capacity to learn unfamiliar concepts."
          },
          {
            id: 4,
            question: "What actually determines whether you succeed in this course?",
            placeholder: "e.g., Consistent practice, asking questions, completing assignments, and patience.",
            guidance: "Focus on daily input rather than fearful outcome predictions."
          },
          {
            id: 5,
            question: "What is a balanced, growth-oriented mindset?",
            placeholder: "e.g., It's normal to feel challenged right now because it's brand new. If I put in 30 minutes of practice daily, I will build mastery step by step.",
            guidance: "Adopt the mindset of a patient learner."
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
      },
      {
        id: "fortune-telling-4",
        categoryId: "fortune-telling",
        categoryName: "Fortune Telling",
        title: "Financial Budget Review",
        difficulty: "Advanced",
        estimatedMinutes: 6,
        scenario: "You had an unexpected car repair bill of $400 this month. While opening your banking app, your stomach churns and you think: 'I am inevitably going broke. I will never save money, and financial ruin is around the corner.'",
        learningTakeaway: "One unexpected expense does not forecast financial collapse. Fortune telling magnifies a temporary budget dent into inevitable bankruptcy.",
        questions: [
          {
            id: 1,
            question: "What financial doom are you forecasting?",
            placeholder: "e.g., I am doomed to go broke and will never build financial stability.",
            guidance: "State the worst-case financial prophecy."
          },
          {
            id: 2,
            question: "What are the hard numbers of your financial situation right now?",
            placeholder: "e.g., I have an unexpected $400 expense, but I have a steady income and bills are paid this month.",
            guidance: "Look at the actual bank balance and ongoing cash flow."
          },
          {
            id: 3,
            question: "How have you handled financial bumps in the past?",
            placeholder: "e.g., I adjusted spending for a couple of weeks, reduced dining out, and recovered the savings.",
            guidance: "Recall your resilience and resourcefulness."
          },
          {
            id: 4,
            question: "What practical adjustments can you make this month?",
            placeholder: "e.g., Cook at home, postpone discretionary purchases, and allocate a small amount each week to rebuild.",
            guidance: "Shift from passive despair into active budgeting."
          },
          {
            id: 5,
            question: "What is a realistic, grounded financial perspective?",
            placeholder: "e.g., Unexpected expenses are a normal part of life, not a sign of financial ruin. With minor adjustments, my budget will rebalance within a few weeks.",
            guidance: "Restore steady confidence in your financial navigation."
          }
        ]
      }
    ]
  }
];

export const TOTAL_PRACTICE_EXERCISES = 24;

