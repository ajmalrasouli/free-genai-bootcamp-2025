const storyData = {
    scene001: {
        id: "scene001",
        title: "Welcome to Iran",
        location_id: "apartment",
        character_id: "alex",
        bgm: "main_theme",
        dialog: {
            "000": {
                speaker: "player",
                farsi: "شما در آپارتمان جدید خود هستید و نور صبحگاهی از پنجره‌ها می‌تابد.",
                english: "You wake up in your new apartment in Iran. The morning sunlight streams through the blinds as you hear someone in the kitchen.",
                default_next_id: "001"
            },
            "001": {
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
                        next_id: "002"
                    },
                    {
                        english: "Hello. Nice to meet you.",
                        farsi: "سلام. از آشنایی با شما خوشوقتم.",
                        response: {
                            speaker: "alex",
                            farsi: "خوشوقتم! من الکس هستم. تازه به ایران اومدی؟",
                            english: "Nice to meet you! I'm Alex. You just arrived in Iran?"
                        },
                        next_id: "002"
                    }
                ]
            },
            "002": {
                speaker: "alex",
                farsi: "من همینجا زندگی می‌کنم. بیا، یه چیزی درباره‌ی محله بهت بگم.",
                english: "I live here too. Come on, let me tell you about the neighborhood.",
                default_next_id: "003"
            },
            "003": {
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
    scene002: {
        id: "scene002",
        title: "The Language School",
        location_id: "school_exterior",
        character_id: "alex",
        bgm: "street_ambience",
        dialog: {
            "000": {
                speaker: "alex",
                farsi: "اینجاست! مدرسه زبان.",
                english: "Here it is! The language school.",
                default_next_id: "001"
            },
            "001": {
                speaker: "player",
                farsi: "ساختمان قشنگیه!",
                english: "What a beautiful building!",
                default_next_id: "002"
            },
            "002": {
                speaker: "alex",
                farsi: "دکتر احمدی معلم خیلی خوبیه. من باید برم. موفق باشی!",
                english: "Dr. Ahmadi is a great teacher. I need to go now. Good luck!",
                next_scene_id: "scene003"
            }
        }
    },
    scene003: {
        id: "scene003",
        title: "Meeting Dr. Ahmadi",
        location_id: "classroom",
        character_id: "teacher",
        bgm: "main_theme",
        dialog: {
            "000": {
                speaker: "teacher",
                farsi: "سلام و خوش آمدید! من دکتر احمدی هستم.",
                english: "Hello and welcome! I'm Dr. Ahmadi.",
                choices: [
                    {
                        english: "Hello, nice to meet you.",
                        farsi: "سلام، از آشنایی با شما خوشوقتم.",
                        next_id: "001"
                    },
                    {
                        english: "Good morning, Dr. Ahmadi.",
                        farsi: "صبح بخیر، دکتر احمدی.",
                        next_id: "001"
                    }
                ]
            },
            "001": {
                speaker: "teacher",
                farsi: "امروز با حروف الفبای فارسی شروع می‌کنیم.",
                english: "Today we'll start with the Farsi alphabet.",
                default_next_id: "002"
            },
            "002": {
                speaker: "teacher",
                farsi: "این حرف «الف» است. مثل «آب».",
                english: "This letter is 'Alef'. Like in 'Āb' (water).",
                choices: [
                    {
                        english: "Repeat: آب",
                        farsi: "تکرار: آب",
                        response: {
                            speaker: "teacher",
                            farsi: "آفرین! خیلی خوب بود.",
                            english: "Well done! That was very good."
                        },
                        next_id: "003"
                    }
                ]
            },
            "003": {
                speaker: "teacher",
                farsi: "برای تمرین، لطفاً به اداره پست بروید و این فرم را پست کنید.",
                english: "For practice, please go to the post office and mail this form.",
                next_scene_id: "scene004"
            }
        }
    },
    scene004: {
        id: "scene004",
        title: "The Post Office",
        location_id: "post_office",
        character_id: "clerk",
        bgm: "street_ambience",
        dialog: {
            "000": {
                speaker: "player",
                farsi: "شما وارد اداره پست می‌شوید. پشت پیشخوان، کارمندی با عینک مستطیلی نشسته است.",
                english: "You enter the post office. Behind the counter sits a clerk with rectangular glasses.",
                default_next_id: "001",
                emotion: "neutral",
                typing_speed: "normal"
            },
            "001": {
                speaker: "clerk",
                farsi: "سلام، بفرمایید.",
                english: "Hello, how may I help you?",
                choices: [
                    {
                        english: "Hello, I need to mail this form.",
                        farsi: "سلام، می‌خواهم این فرم را پست کنم.",
                        response: {
                            speaker: "clerk",
                            farsi: "بله، البته. اجازه بدهید فرم را ببینم.",
                            english: "Yes, of course. Let me see the form.",
                            emotion: "helpful"
                        },
                        next_id: "002"
                    },
                    {
                        english: "(Show the form without speaking)",
                        farsi: "(بدون حرف زدن، فرم را نشان می‌دهید)",
                        response: {
                            speaker: "clerk",
                            farsi: "آه، فرم مدرسه زبان. باید این قسمت‌ها را پر کنید.",
                            english: "Ah, the language school form. You'll need to fill out these sections.",
                            emotion: "understanding"
                        },
                        next_id: "002"
                    }
                ],
                emotion: "professional",
                typing_speed: "normal"
            },
            "002": {
                speaker: "clerk",
                farsi: "لطفاً نام و آدرس خود را اینجا بنویسید.",
                english: "Please write your name and address here.",
                choices: [
                    {
                        english: "Could you help me with the Farsi writing?",
                        farsi: "می‌توانید در نوشتن فارسی کمکم کنید؟",
                        response: {
                            speaker: "clerk",
                            farsi: "بله، حتماً. بگذارید توضیح بدهم...",
                            english: "Yes, certainly. Let me explain...",
                            emotion: "helpful",
                            typing_speed: "slow"
                        },
                        next_id: "003"
                    }
                ],
                emotion: "professional",
                typing_speed: "normal"
            },
            "003": {
                speaker: "clerk",
                farsi: "خوب، حالا باید تمبر بخرید. هزینه‌اش دو هزار تومان است.",
                english: "Now, you'll need a stamp. That will be 2000 tomans.",
                choices: [
                    {
                        english: "Here you are (hand over the money)",
                        farsi: "بفرمایید (پول را می‌دهید)",
                        next_id: "004"
                    }
                ],
                emotion: "professional",
                typing_speed: "normal"
            },
            "004": {
                speaker: "clerk",
                farsi: "متشکرم. فرم شما فردا به مدرسه می‌رسد.",
                english: "Thank you. Your form will reach the school tomorrow.",
                default_next_id: "005",
                emotion: "pleased",
                typing_speed: "normal"
            },
            "005": {
                speaker: "player",
                farsi: "موفق شدید فرم را پست کنید. وقت برگشتن به خانه است.",
                english: "You successfully mailed the form. Time to head back home.",
                next_scene_id: "scene005",
                emotion: "accomplished",
                typing_speed: "normal"
            }
        }
    },
    scene005: {
        id: "scene005",
        title: "Back Home",
        location_id: "apartment",
        character_id: "alex",
        bgm: "main_theme",
        dialog: {
            "000": {
                speaker: "alex",
                farsi: "برگشتی! چطور بود؟",
                english: "You're back! How did it go?",
                choices: [
                    {
                        english: "It went well! The clerk was very helpful.",
                        farsi: "خوب بود! کارمند خیلی کمک کرد.",
                        response: {
                            speaker: "alex",
                            farsi: "عالیه! راستی، می‌خوای بریم کافه؟",
                            english: "Great! Hey, want to go to the café?",
                            emotion: "excited"
                        },
                        next_id: "001"
                    },
                    {
                        english: "It was a bit challenging, but I managed.",
                        farsi: "یک کم سخت بود، ولی موفق شدم.",
                        response: {
                            speaker: "alex",
                            farsi: "مهم نیست، کم کم بهتر می‌شه. بریم کافه؟",
                            english: "Don't worry, it gets easier. Want to go to the café?",
                            emotion: "supportive"
                        },
                        next_id: "001"
                    }
                ],
                emotion: "curious",
                typing_speed: "normal"
            },
            "001": {
                speaker: "alex",
                farsi: "کافه‌ای می‌شناسم که باریستا فارسی عالی حرف می‌زنه!",
                english: "I know a café where the barista speaks great Farsi!",
                next_scene_id: "scene006",
                emotion: "enthusiastic",
                typing_speed: "excited"
            }
        }
    },
    scene006: {
        id: "scene006",
        title: "The Café",
        location_id: "cafe",
        character_id: "barista",
        bgm: "cafe_ambience",
        dialog: {
            "000": {
                speaker: "player",
                farsi: "شما و الکس وارد یک کافه دنج می‌شوید. بوی قهوه تازه در فضا پیچیده است.",
                english: "You and Alex enter a cozy café. The aroma of fresh coffee fills the air.",
                default_next_id: "001",
                emotion: "neutral",
                typing_speed: "normal",
                sfx: "door_bell"
            },
            "001": {
                speaker: "barista",
                farsi: "سلام، خوش آمدید!",
                english: "Hello, welcome!",
                default_next_id: "002",
                emotion: "friendly",
                typing_speed: "excited"
            },
            "002": {
                speaker: "alex",
                farsi: "سلام رضا! ایشون دوست جدیدم هستن که تازه به ایران اومدن.",
                english: "Hi Reza! This is my new friend who just moved to Iran.",
                default_next_id: "003",
                emotion: "excited",
                typing_speed: "normal"
            },
            "003": {
                speaker: "barista",
                farsi: "خیلی خوش اومدین! چی میل دارین؟",
                english: "Very welcome! What would you like to have?",
                choices: [
                    {
                        english: "Could you explain the menu in Farsi?",
                        farsi: "می‌تونید منو رو به فارسی توضیح بدید؟",
                        response: {
                            speaker: "barista",
                            farsi: "البته! ببینید، ما قهوه‌های مختلف داریم...",
                            english: "Of course! Look, we have different types of coffee...",
                            emotion: "helpful",
                            typing_speed: "slow",
                            sfx: "paper_rustle"
                        },
                        next_id: "004"
                    },
                    {
                        english: "I'll have what Alex is having",
                        farsi: "همون چیزی که الکس سفارش میده",
                        response: {
                            speaker: "barista",
                            farsi: "دو تا لاته با شیر بادام، درسته؟",
                            english: "Two almond milk lattes, right?",
                            emotion: "friendly",
                            typing_speed: "normal"
                        },
                        next_id: "005"
                    }
                ],
                emotion: "friendly",
                typing_speed: "normal"
            },
            "004": {
                speaker: "barista",
                farsi: "قهوه ترک، اسپرسو، لاته، کاپوچینو... و البته دمنوش‌های سنتی ایرانی هم داریم.",
                english: "Turkish coffee, espresso, latte, cappuccino... and of course, we have traditional Iranian herbal teas.",
                choices: [
                    {
                        english: "I'd like to try the Iranian tea",
                        farsi: "می‌خوام دمنوش ایرانی رو امتحان کنم",
                        response: {
                            speaker: "barista",
                            farsi: "انتخاب خوبیه! دمنوش زعفران و گل محمدی براتون میارم.",
                            english: "Great choice! I'll bring you saffron and rose tea.",
                            emotion: "pleased",
                            typing_speed: "normal",
                            sfx: "pour_tea"
                        },
                        next_id: "006"
                    }
                ],
                emotion: "helpful",
                typing_speed: "normal"
            },
            "005": {
                speaker: "barista",
                farsi: "بفرمایید، دو تا لاته. نوش جان!",
                english: "Here you are, two lattes. Enjoy!",
                default_next_id: "007",
                emotion: "pleased",
                typing_speed: "normal",
                sfx: "coffee_machine"
            },
            "006": {
                speaker: "barista",
                farsi: "بفرمایید، دمنوش مخصوص ما. نوش جان!",
                english: "Here's our special herbal tea. Enjoy!",
                default_next_id: "007",
                emotion: "pleased",
                typing_speed: "normal",
                sfx: "pour_tea"
            },
            "007": {
                speaker: "alex",
                farsi: "راستی، رضا خیلی خوب فارسی درس میده. شاید بتونه بهت کمک کنه.",
                english: "By the way, Reza is a great Farsi teacher. Maybe he can help you.",
                default_next_id: "008",
                emotion: "supportive",
                typing_speed: "normal"
            },
            "008": {
                speaker: "barista",
                farsi: "با کمال میل! هر وقت اومدی کافه، می‌تونیم تمرین کنیم.",
                english: "I'd be happy to! Whenever you come to the café, we can practice.",
                default_next_id: "009",
                emotion: "enthusiastic",
                typing_speed: "normal"
            },
            "009": {
                speaker: "player",
                farsi: "خیلی ممنون! من بعداً برمی‌گردم.",
                english: "Thank you very much! I'll come back later.",
                default_next_id: "010",
                emotion: "happy",
                typing_speed: "normal"
            },
            "010": {
                speaker: "alex",
                farsi: "خب، باید برگردیم به خانه. روز پر مشغله‌ای بود!",
                english: "Well, we should head back home. It's been a busy day!",
                default_next_id: "011",
                emotion: "satisfied",
                typing_speed: "normal"
            },
            "011": {
                speaker: "player",
                farsi: "در طول یک روز، من با افراد مختلف فارسی صحبت کردم، به مدرسه‌ی زبان رفتم، و یک بسته پستی فرستادم!",
                english: "In just one day, I spoke Farsi with different people, went to language school, and mailed a package!",
                default_next_id: "012",
                typing_speed: "normal"
            },
            "012": {
                speaker: "alex",
                farsi: "تو خیلی سریع یاد می‌گیری! فردا چیزهای بیشتری یاد خواهی گرفت.",
                english: "You're learning so quickly! Tomorrow you'll learn even more.",
                next_scene_id: "scene001",
                emotion: "excited",
                typing_speed: "normal"
            }
        }
    },
    scene007: {
        id: "scene007",
        title: "The End",
        location_id: "apartment",
        character_id: "player",
        bgm: "main_theme",
        dialog: {
            "000": {
                speaker: "player",
                farsi: "شما به خانه برگشتید. روز پر از تجربه و یادگیری بود.",
                english: "You returned home. It was a day full of experience and learning.",
                default_next_id: "001",
                emotion: "happy",
                typing_speed: "normal"
            },
            "001": {
                speaker: "player",
                farsi: "شما به خودتان می‌گویید که فردا هم روز خوبی خواهد بود.",
                english: "You tell yourself that tomorrow will be a great day too.",
                default_next_id: "002",
                emotion: "positive",
                typing_speed: "normal"
            },
            "002": {
                speaker: "player",
                farsi: "شما به خواب می‌روید و منتظر فردا هستید.",
                english: "You go to sleep, looking forward to tomorrow.",
                default_next_id: "003",
                emotion: "relaxed",
                typing_speed: "normal"
            },
            "003": {
                speaker: "player",
                farsi: "پایان.",
                english: "The End.",
                emotion: "neutral",
                typing_speed: "normal"
            }
        }
    }
};
