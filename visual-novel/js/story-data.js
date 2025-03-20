const storyData = {
    "scene001": {
        id: "scene001",
        title: "Welcome to Iran",
        location_id: "apartment",
        character_id: "alex",
        bgm: "main-theme",
        dialog: {
            "0": {
                speaker: "narrator",
                farsi: "شما در آپارتمان جدید خود هستید و نور صبحگاهی از پنجره‌ها می‌تابد.",
                english: "You wake up in your new apartment in Iran. The morning sunlight streams through the blinds as you hear someone in the kitchen.",
                default_next_id: "1"
            },
            "1": {
                speaker: "alex",
                farsi: "صبح بخیر! بیدار شدی؟",
                english: "Oh, you're up! Good morning!",
                choices: [
                    {
                        english: "Good morning. You must be Alex?",
                        farsi: "صبح بخیر. شما باید الکس باشید؟",
                        response: {
                            speaker: "alex",
                            farsi: "بله، درسته! من الکس هستم.",
                            english: "That's right! I'm Alex."
                        },
                        next_id: "2"
                    },
                    {
                        english: "Hello. Nice to meet you.",
                        farsi: "سلام. از آشنایی با شما خوشوقتم.",
                        response: {
                            speaker: "alex",
                            farsi: "خوشوقتم! من الکس هستم. تازه به ایران اومدی؟",
                            english: "Nice to meet you! I'm Alex. You just arrived in Iran?"
                        },
                        next_id: "2"
                    }
                ]
            },
            "2": {
                speaker: "alex",
                farsi: "من همینجا زندگی می‌کنم. بیا، یه چیزی درباره‌ی محله بهت بگم.",
                english: "I live here too. Come on, let me tell you about the neighborhood.",
                default_next_id: "3"
            },
            "3": {
                speaker: "alex",
                farsi: "مدرسه زبان نزدیکه، فقط ده دقیقه پیاده‌روی.",
                english: "The language school is close, just a 10-minute walk.",
                choices: [
                    {
                        english: "That's convenient! Can you show me the way?",
                        farsi: "چه خوب! می‌تونی راه رو نشونم بدی؟",
                        next_scene_id: "scene002"
                    },
                    {
                        english: "Great! I'll find it on my own.",
                        farsi: "عالیه! خودم پیداش می‌کنم.",
                        next_scene_id: "scene002"
                    }
                ]
            }
        }
    },
    "scene002": {
        id: "scene002",
        title: "The Language School",
        location_id: "school_exterior",
        character_id: "dr_ahmadi",
        bgm: "street-ambience",
        dialog: {
            "0": {
                speaker: "alex",
                farsi: "اینجاست! مدرسه زبان.",
                english: "Here it is! The language school.",
                default_next_id: "1"
            },
            "1": {
                speaker: "narrator",
                farsi: "ساختمان قشنگیه!",
                english: "What a beautiful building!",
                default_next_id: "2"
            },
            "2": {
                speaker: "dr_ahmadi",
                farsi: "سلام! خوش آمدید به مدرسه زبان ما.",
                english: "Hello! Welcome to our language school.",
                next_scene_id: "scene003"
            }
        }
    },
    "scene003": {
        id: "scene003",
        title: "Meeting Dr. Ahmadi",
        location_id: "classroom",
        character_id: "dr_ahmadi",
        bgm: "main-theme",
        dialog: {
            "0": {
                speaker: "dr_ahmadi",
                farsi: "سلام و خوش آمدید! من دکتر احمدی هستم.",
                english: "Hello and welcome! I'm Dr. Ahmadi.",
                choices: [
                    {
                        english: "Hello, nice to meet you.",
                        farsi: "سلام، از آشنایی با شما خوشوقتم.",
                        next_id: "1"
                    },
                    {
                        english: "Good morning, Dr. Ahmadi.",
                        farsi: "صبح بخیر، دکتر احمدی.",
                        next_id: "1"
                    }
                ]
            },
            "1": {
                speaker: "dr_ahmadi",
                farsi: "امروز با حروف الفبای فارسی شروع می‌کنیم.",
                english: "Today we'll start with the Farsi alphabet.",
                default_next_id: "2"
            },
            "2": {
                speaker: "dr_ahmadi",
                farsi: "این حرف «الف» است. مثل «آب».",
                english: "This letter is 'Alef'. Like in 'Āb' (water).",
                choices: [
                    {
                        english: "Repeat: آب",
                        farsi: "تکرار: آب",
                        response: {
                            speaker: "dr_ahmadi",
                            farsi: "آفرین! خیلی خوب بود.",
                            english: "Well done! That was very good."
                        },
                        next_id: "3"
                    }
                ]
            },
            "3": {
                speaker: "dr_ahmadi",
                farsi: "برای تمرین، لطفاً به اداره پست بروید و این فرم را پست کنید.",
                english: "For practice, please go to the post office and mail this form.",
                next_scene_id: "scene004"
            }
        }
    },
    "scene004": {
        id: "scene004",
        title: "The Post Office",
        location_id: "post_office",
        character_id: "hassan",
        bgm: "street-ambience",
        dialog: {
            "0": {
                speaker: "narrator",
                farsi: "شما وارد اداره پست می‌شوید. پشت پیشخوان، کارمندی با عینک مستطیلی نشسته است.",
                english: "You enter the post office. Behind the counter sits a clerk with rectangular glasses.",
                default_next_id: "1"
            },
            "1": {
                speaker: "hassan",
                farsi: "سلام، بفرمایید.",
                english: "Hello, how may I help you?",
                choices: [
                    {
                        english: "Hello, I need to mail this form.",
                        farsi: "سلام، می‌خواهم این فرم را پست کنم.",
                        response: {
                            speaker: "hassan",
                            farsi: "بله، البته. اجازه بدهید فرم را ببینم.",
                            english: "Yes, of course. Let me see the form."
                        },
                        next_id: "2"
                    },
                    {
                        english: "(Show the form without speaking)",
                        farsi: "(بدون حرف زدن، فرم را نشان می‌دهید)",
                        response: {
                            speaker: "hassan",
                            farsi: "آه، فرم مدرسه زبان. باید این قسمت‌ها را پر کنید.",
                            english: "Ah, the language school form. You'll need to fill out these sections."
                        },
                        next_id: "2"
                    }
                ]
            },
            "2": {
                speaker: "hassan",
                farsi: "لطفاً نام و آدرس خود را اینجا بنویسید.",
                english: "Please write your name and address here.",
                choices: [
                    {
                        english: "Could you help me with the Farsi writing?",
                        farsi: "می‌توانید در نوشتن فارسی کمکم کنید؟",
                        response: {
                            speaker: "hassan",
                            farsi: "البته! من کمکتان می‌کنم.",
                            english: "Of course! I'll help you."
                        },
                        next_id: "3"
                    }
                ]
            },
            "3": {
                speaker: "hassan",
                farsi: "خیلی خوب! حالا باید امضا کنید.",
                english: "Very good! Now you need to sign here.",
                default_next_id: "4"
            },
            "4": {
                speaker: "narrator",
                farsi: "در طول یک روز، من با افراد مختلف فارسی صحبت کردم، به مدرسه‌ی زبان رفتم، و یک بسته پستی فرستادم!",
                english: "In just one day, I've spoken Farsi with different people, gone to language school, and mailed a package!",
                default_next_id: "5"
            },
            "5": {
                speaker: "hassan",
                farsi: "موفق شدید فرم را پست کنید. وقت برگشتن به خانه است.",
                english: "You've successfully mailed the form. Time to head home.",
                next_scene_id: "scene005"
            }
        }
    },
    "scene005": {
        id: "scene005",
        title: "Back Home",
        location_id: "apartment",
        character_id: "alex",
        bgm: "main-theme",
        dialog: {
            "0": {
                speaker: "alex",
                farsi: "هی! روز خوبی داشتی؟ بیا بریم کافه!",
                english: "Hey! Had a good day? Let's go to the café!",
                choices: [
                    {
                        english: "Yes, let's go!",
                        farsi: "بله، بریم!",
                        next_scene_id: "scene006"
                    },
                    {
                        english: "Sure, I could use some coffee.",
                        farsi: "حتماً، یه قهوه می‌چسبه.",
                        next_scene_id: "scene006"
                    }
                ]
            }
        }
    },
    "scene006": {
        id: "scene006",
        title: "The Café",
        location_id: "cafe",
        character_id: "maryam",
        bgm: "cafe-ambience",
        dialog: {
            "0": {
                speaker: "narrator",
                farsi: "شما و الکس وارد یک کافه دنج می‌شوید. بوی قهوه تازه در فضا پیچیده است.",
                english: "You and Alex enter a cozy café. The aroma of fresh coffee fills the air.",
                default_next_id: "1"
            },
            "1": {
                speaker: "maryam",
                farsi: "سلام، خوش آمدید!",
                english: "Hello, welcome!",
                default_next_id: "2"
            },
            "2": {
                speaker: "alex",
                farsi: "سلام مریم! حال شما چطوره؟",
                english: "Hi Maryam! How are you?",
                default_next_id: "3"
            },
            "3": {
                speaker: "maryam",
                farsi: "خوبم، ممنون! چی میل دارید؟",
                english: "I'm good, thanks! What would you like?",
                choices: [
                    {
                        english: "A latte, please.",
                        farsi: "یک لاته، لطفاً.",
                        response: {
                            speaker: "maryam",
                            farsi: "بفرمایید، دو تا لاته. نوش جان!",
                            english: "Here you are, two lattes. Enjoy!"
                        },
                        next_id: "4"
                    },
                    {
                        english: "What do you recommend?",
                        farsi: "چی پیشنهاد می‌کنید؟",
                        response: {
                            speaker: "maryam",
                            farsi: "دمنوش مخصوص ما عالیه!",
                            english: "Our special herbal tea is excellent!"
                        },
                        next_id: "4"
                    }
                ]
            },
            "4": {
                speaker: "alex",
                farsi: "خب، تعریف کن. روز اول چطور بود؟",
                english: "So, tell me. How was your first day?",
                default_next_id: "5"
            },
            "5": {
                speaker: "narrator",
                farsi: "شما درباره‌ی تجربیات روز اول خود صحبت می‌کنید...",
                english: "You talk about your experiences from the first day...",
                next_scene_id: "scene007"
            }
        }
    },
    "scene007": {
        id: "scene007",
        title: "The End",
        location_id: "apartment",
        character_id: "alex",
        bgm: "main-theme",
        dialog: {
            "0": {
                speaker: "narrator",
                farsi: "شما به خانه برگشتید. روز پر از تجربه و یادگیری بود.",
                english: "You return home. It was a day full of experiences and learning.",
                default_next_id: "1"
            },
            "1": {
                speaker: "narrator",
                farsi: "شما به خودتان می‌گویید که فردا هم روز خوبی خواهد بود.",
                english: "You tell yourself that tomorrow will be another good day.",
                default_next_id: "2"
            },
            "2": {
                speaker: "narrator",
                farsi: "شما به خواب می‌روید و منتظر فردا هستید.",
                english: "You drift off to sleep, looking forward to tomorrow.",
                default_next_id: "3"
            },
            "3": {
                speaker: "narrator",
                farsi: "پایان.",
                english: "The End.",
                next_scene_id: "scene001"
            }
        }
    }
};
