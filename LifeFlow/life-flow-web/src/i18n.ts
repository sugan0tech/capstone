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
                    orders: {
                        my_orders: "எனது ஆடர்கள்",
                        create_order: "ஆடரை உருவாக்கு",
                        new_order: "புதிய ஆடரை உருவாக்கு",
                        client_id: "கிளையன்ட் ஐடி",
                        required: "தேவையானது",
                        max_quantity: "அதிகபட்ச அளவு",
                        order_description: "ஆடர் விவரம்",
                        optional: "விருப்பமானது",
                        order_type: "ஆடர் வகை",
                        fixed: "நிலையானது",
                        blood_types: "இரத்த வகைகளைத் தேர்ந்தெடுக்கவும்",
                        antigen_types: "ஆண்டிஜன் வகைகளைத் தேர்ந்தெடுக்கவும்",
                        blood_subtypes: "இரத்த துணைவகைகளைத் தேர்ந்தெடுக்கவும்",
                        submit: "சமர்ப்பிக்கவும்",
                        close: "மூடவும்",
                        loading: "ஏற்றுகிறது",
                        order_created: "ஆடர் வெற்றிகரமாக உருவாக்கப்பட்டது!",
                        amount: "தொகை: ${{amount}}",
                        proceed_to_payment: "கட்டண வாயிலுக்குச் செல்லவும்",
                        pay_now: "இப்போது செலுத்துங்கள்"
                    }
                }
            },
            hi: {
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
