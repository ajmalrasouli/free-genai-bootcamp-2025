const scenes = {
    intro: {
        background: 'assets/backgrounds/school-exterior.jpg',
        character: null,
        characterName: '',
        dialogue: 'Welcome to your one-month Farsi language learning journey in Iran. You\'ve just arrived at the private language school...',
        choices: [
            {
                text: 'Enter the school',
                nextScene: 'classroom_first_day'
            }
        ]
    },

    classroom_first_day: {
        background: 'assets/backgrounds/classroom.jpg',
        character: 'assets/characters/teacher.jpeg',
        characterName: 'Dr. Fatima Ahmadi',
        dialogue: 'سلام و خوش آمدید! (Hello and welcome!) I\'m Dr. Fatima Ahmadi, and I\'ll be your teacher for this course.',
        choices: [
            {
                text: 'سلام (Hello)',
                nextScene: 'classroom_introduction'
            },
            {
                text: 'Hello (in English)',
                nextScene: 'classroom_introduction_english'
            }
        ]
    },

    classroom_introduction: {
        background: 'assets/backgrounds/classroom.jpg',
        character: 'assets/characters/teacher.jpeg',
        characterName: 'Dr. Fatima Ahmadi',
        dialogue: 'آفرین! (Well done!) I see you\'ve already learned some basic Farsi. Let\'s meet your classmates.',
        choices: [
            {
                text: 'Continue',
                nextScene: 'meet_classmates'
            }
        ]
    },

    classroom_introduction_english: {
        background: 'assets/backgrounds/classroom.jpg',
        character: 'assets/characters/teacher.jpeg',
        characterName: 'Dr. Fatima Ahmadi',
        dialogue: 'Don\'t worry, we\'ll start from the basics. Let\'s begin by learning how to say "hello" in Farsi: سلام (salām).',
        choices: [
            {
                text: 'Try saying: سلام',
                nextScene: 'meet_classmates'
            }
        ]
    },

    meet_classmates: {
        background: 'assets/backgrounds/classroom.jpg',
        character: 'assets/characters/student1.jpeg',
        characterName: 'Park Ji-eun',
        dialogue: 'سلام! I\'m Ji-eun from South Korea. Nice to meet you!',
        choices: [
            {
                text: 'Nice to meet you too!',
                nextScene: 'meet_carlos'
            }
        ]
    },

    meet_carlos: {
        background: 'assets/backgrounds/classroom.jpg',
        character: 'assets/characters/student2.jpeg',
        characterName: 'Garcia Carlos',
        dialogue: 'خوشبختم (Pleased to meet you). I\'m Carlos from Spain. I see you\'re also here to learn Farsi.',
        choices: [
            {
                text: 'Yes, I\'m excited to learn',
                nextScene: 'first_lesson'
            },
            {
                text: 'خوشبختم (Pleased to meet you)',
                onSelect: (state) => {
                    state.flags.usedFarsi = true;
                },
                nextScene: 'first_lesson'
            }
        ]
    }
};
