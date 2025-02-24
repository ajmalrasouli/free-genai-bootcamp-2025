import json
from typing import Dict, List, Optional
from transformers import pipeline
import random

class QuestionGenerator:
    def __init__(self):
        # Initialize the text generation pipeline with a free multilingual model
        try:
            self.generator = pipeline('text-generation', 
                                   model='facebook/mbart-large-50-many-to-many-mmt',
                                   device=-1)  # Use CPU
        except Exception as e:
            print(f"Warning: Could not load AI model: {str(e)}")
            self.generator = None
            
        # Load predefined question templates by topic
        self.templates = {
            "Daily Conversation": [
                {
                    "Introduction": "به گفتگوی زیر گوش دهید و به سوال پاسخ دهید",
                    "Conversation": "مرد: سلام، حال شما چطور است؟\nزن: تشکر، خوب هستم.",
                    "Question": "زن چه گفت؟",
                    "Options": [
                        "او گفت که خوب است",
                        "او گفت که مریض است",
                        "او گفت که خسته است",
                        "او جواب نداد"
                    ],
                    "CorrectAnswer": 1
                },
                {
                    "Introduction": "به این مکالمه گوش دهید",
                    "Conversation": "مرد: ببخشید، ساعت چند است؟\nزن: ساعت سه بعد از ظهر است.",
                    "Question": "ساعت چند است؟",
                    "Options": [
                        "ساعت سه بعد از ظهر است",
                        "ساعت سه صبح است",
                        "ساعت شش بعد از ظهر است",
                        "ساعت نه شب است"
                    ],
                    "CorrectAnswer": 1
                }
            ],
            "Work and Business": [
                {
                    "Introduction": "به این گفتگو گوش کنید",
                    "Conversation": "مرد: شما کجا کار می‌کنید؟\nزن: من در یک مکتب کار می‌کنم.",
                    "Question": "زن کجا کار می‌کند؟",
                    "Options": [
                        "در مکتب",
                        "در شفاخانه",
                        "در دفتر",
                        "در دکان"
                    ],
                    "CorrectAnswer": 1
                },
                {
                    "Introduction": "به این مکالمه توجه کنید",
                    "Conversation": "مرد: ساعت کاری شما چند است؟\nزن: من از ساعت ۸ صبح تا ۴ بعد از ظهر کار می‌کنم.",
                    "Question": "زن چند ساعت کار می‌کند؟",
                    "Options": [
                        "۸ ساعت",
                        "۶ ساعت",
                        "۱۰ ساعت",
                        "۴ ساعت"
                    ],
                    "CorrectAnswer": 1
                }
            ],
            "Shopping": [
                {
                    "Introduction": "به این گفتگو در دکان گوش کنید",
                    "Conversation": "مشتری: قیمت این پیراهن چند است؟\nفروشنده: این پیراهن ۱۵۰۰ افغانی است.",
                    "Question": "قیمت پیراهن چند است؟",
                    "Options": [
                        "۱۵۰۰ افغانی",
                        "۵۰۰ افغانی",
                        "۲۰۰۰ افغانی",
                        "۱۰۰۰ افغانی"
                    ],
                    "CorrectAnswer": 1
                },
                {
                    "Introduction": "به این مکالمه در بازار گوش دهید",
                    "Conversation": "خریدار: آیا رنگ دیگری هم دارید؟\nفروشنده: بله، ما رنگ سبز و آبی هم داریم.",
                    "Question": "فروشنده چه رنگ‌هایی دارد؟",
                    "Options": [
                        "سبز و آبی",
                        "فقط سبز",
                        "سرخ و زرد",
                        "فقط آبی"
                    ],
                    "CorrectAnswer": 1
                }
            ],
            "Travel": [
                {
                    "Introduction": "به این گفتگو در میدان هوایی گوش دهید",
                    "Conversation": "مسافر: پرواز بعدی به کابل چه وقت است؟\nکارمند: پرواز بعدی ساعت ۲ بعد از ظهر است.",
                    "Question": "پرواز بعدی چه زمانی است؟",
                    "Options": [
                        "ساعت ۲ بعد از ظهر",
                        "ساعت ۲ صبح",
                        "ساعت ۴ بعد از ظهر",
                        "ساعت ۶ شب"
                    ],
                    "CorrectAnswer": 1
                },
                {
                    "Introduction": "به این مکالمه در هوتل گوش کنید",
                    "Conversation": "مهمان: یک اتاق برای دو شب می‌خواهم.\nپذیرش: بله، قیمت هر شب ۳۰۰۰ افغانی است.",
                    "Question": "مهمان برای چند شب اتاق می‌خواهد؟",
                    "Options": [
                        "دو شب",
                        "یک شب",
                        "سه شب",
                        "چهار شب"
                    ],
                    "CorrectAnswer": 1
                }
            ],
            "Health and Medical": [
                {
                    "Introduction": "به این گفتگو در شفاخانه گوش دهید",
                    "Conversation": "داکتر: چه مشکلی دارید؟\nمریض: من سردرد و تب دارم.",
                    "Question": "مریض چه مشکلی دارد؟",
                    "Options": [
                        "سردرد و تب",
                        "فقط سردرد",
                        "گلودرد",
                        "دل درد"
                    ],
                    "CorrectAnswer": 1
                },
                {
                    "Introduction": "به این مکالمه با داکتر گوش کنید",
                    "Conversation": "داکتر: چند روز است که مریض هستید؟\nمریض: از سه روز پیش مریض شدم.",
                    "Question": "مریض از چه زمانی مریض شده است؟",
                    "Options": [
                        "سه روز پیش",
                        "یک هفته پیش",
                        "دیروز",
                        "یک ماه پیش"
                    ],
                    "CorrectAnswer": 1
                }
            ]
        }

    def generate_similar_question(self, section_num: int, topic: str) -> Dict:
        """Generate a new question based on templates and topic"""
        try:
            # Get templates for the selected topic
            topic_templates = self.templates.get(topic, [])
            
            # If no templates for this topic, use templates from any topic
            if not topic_templates:
                all_templates = []
                for templates in self.templates.values():
                    all_templates.extend(templates)
                return random.choice(all_templates)
            
            # Return a random template for the selected topic
            return random.choice(topic_templates)
            
        except Exception as e:
            print(f"Error generating question: {str(e)}")
            # Return a random template as fallback
            all_templates = []
            for templates in self.templates.values():
                all_templates.extend(templates)
            return random.choice(all_templates)

    def get_feedback(self, question: Dict, selected_answer: int) -> Dict:
        """Generate feedback for the selected answer"""
        correct_answer = question.get('CorrectAnswer', 1)
        is_correct = selected_answer == correct_answer
        
        if is_correct:
            feedback_templates = [
                "آفرین! جواب شما درست است.",
                "بسیار خوب! شما به دقت گوش دادید.",
                "درست است! شما خوب فهمیدید."
            ]
            explanation = random.choice(feedback_templates)
        else:
            feedback_templates = [
                "جواب درست نیست. لطفاً دوباره گوش دهید.",
                "متأسفانه این جواب درست نیست. یک بار دیگر تلاش کنید.",
                "اشتباه است. به مکالمه با دقت بیشتری گوش دهید."
            ]
            explanation = random.choice(feedback_templates)
            
        return {
            "correct": is_correct,
            "explanation": explanation
        }
