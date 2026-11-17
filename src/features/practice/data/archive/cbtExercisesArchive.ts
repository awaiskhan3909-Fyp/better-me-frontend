// Archived CBT Exercises (12 exercises across 6 distortions)
// Kept for historical reference, rotation, and retrieval.
import { DistortionCategory, CBTExerciseItem } from "../cbtExercisesData";

export const ARCHIVED_CBT_EXERCISES: DistortionCategory[] = [
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
    description: "Stop assuming you know what others think without real evidence.",
    themeColor: "#7c3aed",
    bgLight: "bg-purple-50/70",
    borderColor: "border-purple-100",
    iconName: "Eye",
    exercises: [
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
    description: "Break the habit of treating a single event as a never-ending pattern.",
    themeColor: "#0d9488",
    bgLight: "bg-teal-50/70",
    borderColor: "border-teal-100",
    iconName: "Globe",
    exercises: [
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
    description: "Move beyond black-and-white judgements to embrace healthy middle ground.",
    themeColor: "#d97706",
    bgLight: "bg-amber-50/70",
    borderColor: "border-amber-100",
    iconName: "Split",
    exercises: [
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
    description: "Separate emotional feelings from objective reality and factual truths.",
    themeColor: "#e11d48",
    bgLight: "bg-rose-50/70",
    borderColor: "border-rose-100",
    iconName: "HeartPulse",
    exercises: [
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
    description: "Question automatic negative predictions about future outcomes.",
    themeColor: "#2563eb",
    bgLight: "bg-indigo-50/70",
    borderColor: "border-indigo-100",
    iconName: "Compass",
    exercises: [
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

export const TOTAL_ARCHIVED_EXERCISES = 12;
