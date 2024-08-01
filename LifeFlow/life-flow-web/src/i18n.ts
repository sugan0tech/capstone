import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: "en",
        returnObjects: true,
        resources: {
            en: {
                translation: {
                    greet: "Greet",
                    stats: {
                        total_units: "Total Units",
                        total_units_desc: "21% more in last month",
                        life_saved: "Life Saved",
                        life_saved_desc: "0% casualty for insufficient blood",
                        blood_banks: "Blood Banks",
                        blood_banks_desc: "Serving all over nation",
                    },
                    hero: {
                        title: "Be a hero in someone's life. Donate blood.",
                        description: "By donating blood, you become a hero in someone's life. Your single act of kindness can save lives in emergencies, support patients with chronic conditions, and ensure the well-being of mothers and newborns. Join us in making a difference—donate blood and be a hero today.",
                        get_started: "Get Started"
                    },
                    navbar: {
                        home: "Home",
                        account: "Account",
                        my_donations: "My Donations",
                        account_info: "Account Info",
                        donations: "Donations",
                        center_console: "Center Console",
                        orders: "Orders",
                        find_donors: "Find Donors",
                        find_centers: "Find Centers",
                        login: "Login",
                        register: "Register",
                        logout: "Logout"
                    },
                    register: {
                        email_placeholder: "Email",
                        username_placeholder: "Username",
                        phone_placeholder: "Phone",
                        password_placeholder: "Password",
                        confirm_password_placeholder: "Retype Password",
                        role_label: "Purpose",
                        donor: "Donor",
                        hospital_admin: "BloodRequest - Hospital",
                        pharma_admin: "BloodRequest - Pharma",
                        register_button: "Register",
                        otp_placeholder: "Enter OTP",
                        submit_otp_button: "Submit OTP",
                        alert_password_mismatch: "Passwords do not match.",
                        alert_registration_success: "Registration successful! Please enter the OTP sent to your email.",
                        alert_registration_fail: "Registration failed. Please try again.",
                        alert_verification_success: "Verification successful! Redirecting to home.",
                        alert_otp_fail: "OTP verification failed. Please try again.",
                    },
                    login: {
                        email_placeholder: "Email",
                        password_placeholder: "Password",
                        remember_me_label: "Remember me",
                        login_button: "Login",
                        login_success: "Login successful!",
                        user_not_found: "User Not found",
                        login_fail: "Login failed. Please try again.",
                    },
                    orders: {
                        my_orders: "My Orders",
                        create_order: "Create Order",
                        new_order: "Create a New Order",
                        client_id: "Client ID",
                        required: "Required",
                        max_quantity: "Max Quantity",
                        order_description: "Order Description",
                        optional: "Optional",
                        order_type: "Order Type",
                        fixed: "Fixed",
                        blood_types: "Select Blood Types",
                        antigen_types: "Select Antigen Types",
                        blood_subtypes: "Select Blood Subtypes",
                        submit: "Submit",
                        close: "Close",
                        loading: "Loading",
                        order_created: "Order created successfully!",
                        amount: "Amount: ${{amount}}",
                        proceed_to_payment: "Proceed to payment gateway",
                        pay_now: "Pay Now"
                    }
                },
            },
            fn: {
                translation: {
                    greet: "Gerotosmas",
                    orders: {
                        my_orders: "Mowi ail;vei",
                        create_order: "Aiemas Order",
                        new_order: "Gererai sorem nuv",
                        client_id: "Clien ID",
                        required: "Reqiued",
                        max_quantity: "Maxi Quantiti",
                        order_description: "Ordir Descripti",
                        optional: "Opthional",
                        order_type: "Ordir Tipe",
                        fixed: "Fiexd",
                        blood_types: "Selec Blood Typis",
                        antigen_types: "Selec Antijen Typis",
                        blood_subtypes: "Selec Blood Subtypis",
                        submit: "Submet",
                        close: "Closi",
                        loading: "Loasing",
                        order_created: "Ordir creatid succesfulli!",
                        amount: "Amoun: ${{amount}}",
                        proceed_to_payment: "Procid to paymin gatewai",
                        pay_now: "Pai Now"
                    }
                }
            },
            ta: {
                translation: {
                    greet: "வணக்கம்",
                    stats: {
                        total_units: "மொத்த அலகுகள்",
                        total_units_desc: "கடந்த மாதத்தை விட 21% அதிகம்",
                        life_saved: "மீட்டெடுக்கப்பட்ட உயிர்கள்",
                        life_saved_desc: "போதிய ரத்தம் இல்லாததால் 0% உயிரிழப்பு",
                        blood_banks: "இரத்த வங்கிகள்",
                        blood_banks_desc: "நாட்டை முழுவதும் சேவை செய்கிறது",
                    },
                    hero: {
                        title: "ஒருவரின் வாழ்க்கையில் நாயகனாக இருங்கள். ரத்த தானம் செய்யுங்கள்.",
                        description: "நீங்கள் ரத்த தானம் செய்வதன் மூலம், ஒருவரின் வாழ்க்கையில் நாயகனாக ஆவீர்கள். உங்கள் ஒரே செயல் அவசரகாலங்களில் வாழ்க்கைகளை காப்பாற்றலாம், நீண்டநாள் நிலைகளுடன் உள்ள நோயாளர்களுக்கு ஆதரவு அளிக்கலாம், மற்றும் தாய்மார்களும் புதிய பிறந்த குழந்தைகளும் நலமுடன் இருக்க உதவலாம். வேறுபாடு உருவாக்க எங்களுடன் சேருங்கள்—இன்று ரத்த தானம் செய்யுங்கள்.",
                        get_started: "தொடங்குங்கள்"
                    },
                    navbar: {
                        home: "முகப்பு",
                        account: "கணக்கு",
                        my_donations: "என் தானங்கள்",
                        account_info: "கணக்கு தகவல்",
                        donations: "தானங்கள்",
                        center_console: "மையக் கட்டுப்பாடு",
                        orders: "ஆணைகள்",
                        find_donors: "தானங்களைத் தேடுங்கள்",
                        find_centers: "மையங்களைப் பரிசீலிக்க",
                        login: "உள் நுழைக",
                        register: "பதிவு செய்யுங்கள்",
                        logout: "வெளியேறு"
                    },
                    register: {
                        email_placeholder: "மின்னஞ்சல்",
                        username_placeholder: "பயனர் பெயர்",
                        phone_placeholder: "தொலைபேசி",
                        password_placeholder: "கடவுச்சொல்",
                        confirm_password_placeholder: "கடவுச்சொல்லை மீண்டும் பதிவிடவும்",
                        role_label: "நோக்கம்",
                        donor: "தானியங்கியாளர்",
                        hospital_admin: "ரத்த கோரிக்கை - மருத்துவமனை",
                        pharma_admin: "ரத்த கோரிக்கை - மருந்தகம்",
                        register_button: "பதிவு",
                        otp_placeholder: "OTP ஐ உள்ளிடவும்",
                        submit_otp_button: "OTP சமர்ப்பிக்கவும்",
                        alert_password_mismatch: "கடவுச்சொற்கள் பொருந்தவில்லை.",
                        alert_registration_success: "பதிவு வெற்றிகரமாக முடிந்தது! உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்.",
                        alert_registration_fail: "பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
                        alert_verification_success: "சரிபார்ப்பு வெற்றிகரமாக முடிந்தது! முகப்புக்கு திருப்பிவைக்கப்படுகிறது.",
                        alert_otp_fail: "OTP சரிபார்ப்பு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
                    },
                    login: {
                        email_placeholder: "மின்னஞ்சல்",
                        password_placeholder: "கடவுச்சொல்",
                        remember_me_label: "என்னை நினைவில் கொள்",
                        login_button: "உள்நுழை",
                        login_success: "உள்நுழைவு வெற்றிகரமாக முடிந்தது!",
                        user_not_found: "பயனர் கிடைக்கவில்லை",
                        login_fail: "உள்நுழைவு தோல்வியுற்றது. மீண்டும் முயற்சிக்கவும்.",
                    },
                    orders: {
                        my_orders: "என் ஆணைகள்",
                        create_order: "ஆணை உருவாக்கு",
                        new_order: "புதிய ஆணை உருவாக்கு",
                        client_id: "வாடிக்கையாளர் ஐடி",
                        required: "தேவை",
                        max_quantity: "அதிகபட்ச அளவு",
                        order_description: "ஆணை விவரம்",
                        optional: "விருப்ப",
                        order_type: "ஆணை வகை",
                        fixed: "நிலையானது",
                        blood_types: "இனவியல் வகைகளைத் தேர்வு செய்யுங்கள்",
                        antigen_types: "என்டிஜன் வகைகளைத் தேர்வு செய்யுங்கள்",
                        blood_subtypes: "இனவியல் துணைவகைகளைத் தேர்வு செய்யுங்கள்",
                        submit: "சமர்ப்பிக்கவும்",
                        close: "மூடுக",
                        loading: "சுமக்கிறது",
                        order_created: "ஆணை வெற்றிகரமாக உருவாக்கப்பட்டது!",
                        amount: "தொகை: ₹{{amount}}",
                        proceed_to_payment: "கொடுப்பனவுக்குச் செல்லுங்கள்",
                        pay_now: "இப்போது செலுத்துங்கள்"
                    }
                }
            }
            , hi: {
                translation: {
                    greet: "नमस्ते",
                    orders: {
                        my_orders: "मेरे ऑर्डर",
                        create_order: "ऑर्डर बनाएं",
                        new_order: "नया ऑर्डर बनाएं",
                        client_id: "क्लाइंट आईडी",
                        required: "आवश्यक",
                        max_quantity: "अधिकतम मात्रा",
                        order_description: "ऑर्डर विवरण",
                        optional: "वैकल्पिक",
                        order_type: "ऑर्डर प्रकार",
                        fixed: "स्थिर",
                        blood_types: "रक्त प्रकार चुनें",
                        antigen_types: "एंटीजन प्रकार चुनें",
                        blood_subtypes: "रक्त उपप्रकार चुनें",
                        submit: "सबमिट करें",
                        close: "बंद करें",
                        loading: "लोड हो रहा है",
                        order_created: "ऑर्डर सफलतापूर्वक बनाया गया!",
                        amount: "राशि: ${{amount}}",
                        proceed_to_payment: "भुगतान गेटवे पर जाएं",
                        pay_now: "अभी भुगतान करें"
                    }
                }
            }
        }

    });

export default i18n;
