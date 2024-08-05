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
                        amount: "Amount: ₹{{amount}}",
                        proceed_to_payment: "Proceed to payment gateway",
                        payment_successful: "Payment Successful",
                        pay_now: "Pay Now",
                        error_submitting_order: "Error Submitting Order",
                        ongoing_orders: "Ongoing Orders",
                        delivered_orders: "Delivered Orders",
                        new_order: "New Order",
                        payment_method: "Select Payment Method",
                        make_payment: "Make Payment",
                        mark_as_delivered: "Mark as Delivered",
                        order_details: "Order Details",
                        description: "Description",
                        quantity: "Quantity",
                        total_price: "Total Price",
                        view_more: "View More",
                        unit_bags: "Unit Bags",
                        blood_subtype: "Blood Subtype",
                        blood_type: "Blood Type",
                        expiry: "Expiry Date",
                        is_rare: "Is Rare",
                        yes: "Yes",
                        no: "No",
                        error_making_payment: "There was an error processing your payment.",
                        dashboard_title: "Orders",
                        approve_order: "Approve",
                        reject_order: "Reject",
                        cancel_order: "Cancel",
                        mark_as_ongoing: "Ongoing"
                    },
                    slots: {
                        ongoingSlotsTitle: "Ongoing Slots",
                        pendingSlotsTitle: "Pending Slots",
                        completedSlotsTitle: "Completed Slots",
                        status: "Status",
                        changeStatus: "Change Status",
                        viewDonorInfo: "View Donor Info",
                        donorInfo: "Donor Information",
                        donorId: "Donor ID",
                        name: "Name",
                        email: "Email",
                        phone: "Phone",
                        bloodType: "Blood Type",
                        bloodSubtype: "Blood Subtype",
                        close: "Close",
                        BloodReceived: "Blood Received",
                        BloodAccepted: "Blood Accepted",
                        BloodRejected: "Blood Rejected",
                        DonorNotArrived: "Donor Not Arrived",
                        Pending: "Pending",
                    },
                    loggedInDevices: {
                        title: "Logged In Devices",
                        loggedInAt: "Logged in at",
                        deviceInfo: "Device Info",
                        logoutDevice: "Logout Device",
                        logoutAllDevices: "Logout All Devices",
                        browser: "browser on"
                    },
                    myAccount: {
                        title: "My Account",
                        userInfoTitle: "User Account Information",
                        resetPasswordButton: "Reset Password",
                    },
                    userInfo: {
                        email: "Email",
                        name: "Name",
                        role: "Role",
                        editButton: "Edit",
                    },
                    editUserInfo: {
                        email: "Email",
                        name: "Name",
                        saveButton: "Save",
                        cancelButton: "Cancel",
                    },
                    resetPassword: {
                        currentPassword: "Current Password",
                        newPassword: "New Password",
                        confirmPassword: "Confirm New Password",
                        passwordLengthError: "Password must be at least 8 characters long",
                        passwordMatchError: "Passwords do not match",
                        saveButton: "Save",
                        cancelButton: "Cancel",
                    },
                    footer: {
                        companyName: "LifeFlow Blood Bank Service Ltd.",
                        tagline: "Helping Humanity since 2024",
                    },
                    centreCard: {
                        donateHere: "Donate Here",
                        orderFromHere: "Order From Here",
                        away: "Away",
                        stock: "Stock",
                        from: "from",
                        to: "to"
                    },
                    locationSearchBar: {
                        placeholder: "Search for a location",
                        noLocationsFound: "No Locations found",
                        clearButton: "Clear",
                    },
                    findCenters: {
                        noCentersFound: "Search for centers to see",
                    },
                    myDonations: {
                        title: "My Donations", // Title for the My Donations page
                        selectedCenter: "Selected Center: {{centerName}}", // Message showing the selected center
                    },
                    alerts: {
                        createDonorProfile: "Please create a donor profile before proceeding.", // Alert message for creating a donor profile
                    },
                    donationHistory: {
                        title: "History", // Title for the history section
                        noDonations: "No donations yet", // Message when there are no donations
                        donatedOn: "Donated on", // Label before the donation date
                        at: "at", // Label before the donation center name
                    },
                    ongoingSlot: {
                        title: "Ongoing Slot", // Title for the card when there is an ongoing slot
                        noSlot: "No ongoing slot", // Title for the card when there is no ongoing slot
                        slotBookedFor: "Slot booked for", // Label for the booked slot details
                        at: "at", // Label before the time of the slot
                        cancelSlot: "Cancel Slot", // Button text for canceling the slot
                        centerNameLabel: "Center Name", // Label for the center name input field
                        centerNamePlaceholder: "Enter the center name", // Placeholder for the center name input field
                        bookSlot: "Book a Slot", // Button text for booking a slot
                        booking: "Booking...", // Button text when the booking is in progress
                        findCentersNearby: "Find Centers Nearby", // Button text for navigating to the Find Centers page
                        alerts: {
                            bookingSuccess: "Booking successful!", // Alert message for a successful booking
                            bookingError: "Error booking slot: ", // Alert message for a booking error
                        },
                    },
                },

            }
            , fn: {
                translation: {
                    greet: "Saluer",
                    stats: {
                        total_units: "Unités Totales",
                        total_units_desc: "21% de plus le mois dernier",
                        life_saved: "Vies Sauvées",
                        life_saved_desc: "0% de décès par manque de sang",
                        blood_banks: "Banques de Sang",
                        blood_banks_desc: "Présentes dans tout le pays",
                    },
                    hero: {
                        title: "Soyez un héros dans la vie de quelqu'un. Donnez du sang.",
                        description: "En donnant du sang, vous devenez un héros dans la vie de quelqu'un. Votre simple acte de générosité peut sauver des vies en cas d'urgence, soutenir les patients atteints de maladies chroniques, et garantir le bien-être des mères et des nouveau-nés. Rejoignez-nous pour faire la différence—donnez du sang et devenez un héros dès aujourd'hui.",
                        get_started: "Commencer"
                    },
                    navbar: {
                        home: "Accueil",
                        account: "Compte",
                        my_donations: "Mes Dons",
                        account_info: "Infos Compte",
                        donations: "Dons",
                        center_console: "Console Centrale",
                        orders: "Commandes",
                        find_donors: "Trouver des Donneurs",
                        find_centers: "Trouver des Centres",
                        login: "Connexion",
                        register: "Inscription",
                        logout: "Déconnexion"
                    },
                    register: {
                        email_placeholder: "Email",
                        username_placeholder: "Nom d'utilisateur",
                        phone_placeholder: "Téléphone",
                        password_placeholder: "Mot de passe",
                        confirm_password_placeholder: "Retaper le mot de passe",
                        role_label: "But",
                        donor: "Donneur",
                        hospital_admin: "Demande de Sang - Hôpital",
                        pharma_admin: "Demande de Sang - Pharma",
                        register_button: "S'inscrire",
                        otp_placeholder: "Entrer l'OTP",
                        submit_otp_button: "Soumettre OTP",
                        alert_password_mismatch: "Les mots de passe ne correspondent pas.",
                        alert_registration_success: "Inscription réussie ! Veuillez entrer l'OTP envoyé à votre email.",
                        alert_registration_fail: "L'inscription a échoué. Veuillez réessayer.",
                        alert_verification_success: "Vérification réussie ! Redirection vers l'accueil.",
                        alert_otp_fail: "Échec de la vérification de l'OTP. Veuillez réessayer.",
                    },
                    login: {
                        email_placeholder: "Email",
                        password_placeholder: "Mot de passe",
                        remember_me_label: "Se souvenir de moi",
                        login_button: "Connexion",
                        login_success: "Connexion réussie !",
                        user_not_found: "Utilisateur non trouvé",
                        login_fail: "Échec de la connexion. Veuillez réessayer.",
                    },
                    orders: {
                        my_orders: "Mes Commandes",
                        create_order: "Créer une Commande",
                        client_id: "ID Client",
                        required: "Requis",
                        max_quantity: "Quantité Maximale",
                        order_description: "Description de la Commande",
                        optional: "Optionnel",
                        order_type: "Type de Commande",
                        fixed: "Fixe",
                        blood_types: "Sélectionner les Groupes Sanguins",
                        antigen_types: "Sélectionner les Types d'Antigènes",
                        blood_subtypes: "Sélectionner les Sous-Types de Sang",
                        submit: "Soumettre",
                        close: "Fermer",
                        loading: "Chargement",
                        order_created: "Commande créée avec succès !",
                        amount: "Montant : ₹{{amount}}",
                        proceed_to_payment: "Passer à la passerelle de paiement",
                        payment_successful: "Paiement Réussi",
                        pay_now: "Payer Maintenant",
                        error_submitting_order: "Erreur lors de la soumission de la commande",
                        ongoing_orders: "Commandes en Cours",
                        delivered_orders: "Commandes Livrées",
                        new_order: "Nouvelle Commande",
                        payment_method: "Sélectionner le Mode de Paiement",
                        make_payment: "Effectuer le Paiement",
                        mark_as_delivered: "Marquer comme Livré",
                        order_details: "Détails de la Commande",
                        description: "Description",
                        quantity: "Quantité",
                        total_price: "Prix Total",
                        view_more: "Voir Plus",
                        unit_bags: "Sacs d'Unités",
                        blood_subtype: "Sous-Type de Sang",
                        blood_type: "Groupe Sanguin",
                        expiry: "Date de Péremption",
                        is_rare: "Est Rare",
                        yes: "Oui",
                        no: "Non",
                        error_making_payment: "Erreur lors du traitement de votre paiement.",
                        dashboard_title: "Commandes",
                        approve_order: "Approuver",
                        reject_order: "Rejeter",
                        cancel_order: "Annuler",
                        mark_as_ongoing: "En Cours"
                    },
                    slots: {
                        ongoingSlotsTitle: "Créneaux en Cours",
                        pendingSlotsTitle: "Créneaux en Attente",
                        completedSlotsTitle: "Créneaux Terminés",
                        status: "Statut",
                        changeStatus: "Changer le Statut",
                        viewDonorInfo: "Voir les Infos du Donneur",
                        donorInfo: "Informations du Donneur",
                        donorId: "ID du Donneur",
                        name: "Nom",
                        email: "Email",
                        phone: "Téléphone",
                        bloodType: "Groupe Sanguin",
                        bloodSubtype: "Sous-Type de Sang",
                        close: "Fermer",
                        BloodReceived: "Sang Reçu",
                        BloodAccepted: "Sang Accepté",
                        BloodRejected: "Sang Rejeté",
                        DonorNotArrived: "Donneur Non Arrivé",
                        Pending: "En Attente",
                    },
                    loggedInDevices: {
                        title: "Appareils Connectés",
                        loggedInAt: "Connecté le",
                        deviceInfo: "Informations de l'Appareil",
                        logoutDevice: "Déconnecter l'Appareil",
                        logoutAllDevices: "Déconnecter Tous les Appareils",
                        browser: "navigateur sur"
                    },
                    myAccount: {
                        title: "Mon Compte",
                        userInfoTitle: "Informations du Compte Utilisateur",
                        resetPasswordButton: "Réinitialiser le Mot de Passe",
                    },
                    userInfo: {
                        email: "Email",
                        name: "Nom",
                        role: "Rôle",
                        editButton: "Éditer",
                    },
                    editUserInfo: {
                        email: "Email",
                        name: "Nom",
                        saveButton: "Enregistrer",
                        cancelButton: "Annuler",
                    },
                    resetPassword: {
                        currentPassword: "Mot de Passe Actuel",
                        newPassword: "Nouveau Mot de Passe",
                        confirmPassword: "Confirmer le Nouveau Mot de Passe",
                        passwordLengthError: "Le mot de passe doit contenir au moins 8 caractères",
                        passwordMatchError: "Les mots de passe ne correspondent pas",
                        saveButton: "Enregistrer",
                        cancelButton: "Annuler",
                    },
                    footer: {
                        companyName: "LifeFlow Blood Bank Service Ltd.",
                        tagline: "Aider l'Humanité depuis 2024",
                    },
                    centreCard: {
                        donateHere: "Donnez Ici",
                        orderFromHere: "Commander Ici",
                        away: "À distance de",
                        stock: "Stock",
                        from: "de",
                        to: "à"
                    },
                    locationSearchBar: {
                        placeholder: "Rechercher un lieu",
                        noLocationsFound: "Aucun lieu trouvé",
                        clearButton: "Effacer",
                    },
                    findCenters: {
                        noCentersFound: "Rechercher des centres à afficher",
                    },
                    myDonations: {
                        title: "Mes Dons",
                        selectedCenter: "Centre Sélectionné : {{centerName}}",
                    },
                    alerts: {
                        createDonorProfile: "Veuillez créer un profil de donneur avant de continuer.",
                    },
                    donationHistory: {
                        title: "Historique",
                        noDonations: "Aucun don pour l'instant",
                        donatedOn: "Donné le",
                        at: "à",
                    },
                    ongoingSlot: {
                        title: "Créneau en Cours",
                        noSlot: "Aucun créneau en cours",
                        slotBookedFor: "Créneau réservé pour",
                        at: "à",
                        cancelSlot: "Annuler le Créneau",
                        centerNameLabel: "Nom du Centre",
                        centerNamePlaceholder: "Entrer le nom du centre",
                        bookSlot: "Réserver un Créneau",
                        booking: "Réservation en cours...",
                        findCentersNearby: "Trouver des Centres à Proximité",
                        alerts: {
                            bookingSuccess: "Réservation réussie !",
                            bookingError: "Erreur lors de la réservation du créneau : ",
                        },
                    },
                },
            }
            , ta: {
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
                    },
                    slots: {
                        ongoingSlotsTitle: "நடைமுறையில் இருக்கும் இடங்கள்",
                        pendingSlotsTitle: "நிலுவையில் உள்ள இடங்கள்",
                        completedSlotsTitle: "முடிந்த இடங்கள்",
                        status: "நிலை",
                        changeStatus: "நிலையை மாற்று",
                        viewDonorInfo: "தானம் வழங்கியவரின் தகவலை காண்க",
                        donorInfo: "தானம் வழங்கியவரின் தகவல்",
                        donorId: "தானம் வழங்கியவரின் ஐடி",
                        name: "பெயர்",
                        email: "மின்னஞ்சல்",
                        phone: "தொலைபேசி",
                        bloodType: "இரத்த வகை",
                        bloodSubtype: "இரத்த துணை வகை",
                        close: "மூடு",
                        BloodReceived: "இரத்தம் பெறப்பட்டது",
                        BloodAccepted: "இரத்தம் ஏற்றுக்கொள்ளப்பட்டது",
                        BloodRejected: "இரத்தம் நிராகரிக்கப்பட்டது",
                        DonorNotArrived: "தானம் வழங்கியவர் வரவில்லை",
                        Pending: "நிலுவையில்",
                    },
                    loggedInDevices: {
                        title: "உள் நுழைந்த சாதனங்கள்",
                        loggedInAt: "உள் நுழைந்த நேரம்",
                        deviceInfo: "சாதனத்தின் விவரங்கள்",
                        logoutDevice: "சாதனத்தை வெளியேற்றவும்",
                        logoutAllDevices: "எல்லா சாதனங்களையும் வெளியேற்றவும்",
                        browser: "உள்ள உலாவி"
                    },
                    myAccount: {
                        title: "என் கணக்கு",
                        userInfoTitle: "பயனர் கணக்கு தகவல்",
                        resetPasswordButton: "கடவுச்சொல்லை மறுஇணைக்கவும்",
                    },
                    userInfo: {
                        email: "மின்னஞ்சல்",
                        name: "பெயர்",
                        role: "பங்கு",
                        editButton: "தொகு",
                    },
                    editUserInfo: {
                        email: "ईमेल",
                        name: "नाम",
                        saveButton: "सहेजें",
                        cancelButton: "रद्द करें",
                    },
                    resetPassword: {
                        currentPassword: "वर्तमान पासवर्ड",
                        newPassword: "नया पासवर्ड",
                        confirmPassword: "नए पासवर्ड की पुष्टि करें",
                        passwordLengthError: "पासवर्ड कम से कम 8 वर्णों का होना चाहिए",
                        passwordMatchError: "पासवर्ड मेल नहीं खाते",
                        saveButton: "सहेजें",
                        cancelButton: "रद्द करें",
                    },
                    footer: {
                        companyName: "லைஃப்ஃப்ளோ ரத்த வங்கி சேவை லிமிடெட்.",
                        tagline: "2024 முதல் மனிதகுலத்திற்கு உதவுகிறது",
                    },
                    centreCard: {
                        donateHere: "இங்கு நன்கொடை அளிக்கவும்",
                        orderFromHere: "இங்கிருந்து ஆர்டர் செய்யவும்",
                        away: "தொலைவில்",
                        stock: "கையிருப்பு",
                        from: "இருந்து",
                        to: "வரை"
                    },
                    locationSearchBar: {
                        placeholder: "ஒரு இடத்தைத் தேடுங்கள்",
                        noLocationsFound: "இடங்கள் இல்லை",
                        clearButton: "நீக்கு",
                    },
                    findCenters: {
                        noCentersFound: "மையங்களை காண தேடுங்கள்",
                    },
                    myDonations: {
                        title: "எனது நன்கொடை", // Title for the My Donations page
                        selectedCenter: "தேர்ந்தெடுக்கப்பட்ட மையம்: {{centerName}}", // Message showing the selected center
                    },
                    alerts: {
                        createDonorProfile: "தொடர்பதற்கு முன் நன்கொடையாளரின் சுயவிவரத்தை உருவாக்குங்கள்.", // Alert message for creating a donor profile
                    },
                    donationHistory: {
                        title: "வரலாறு", // Title for the history section
                        noDonations: "இன்னும் நன்கொடைகள் இல்லை", // Message when there are no donations
                        donatedOn: "நன்கொடை செய்த நாள்", // Label before the donation date
                        at: "இடத்தில்", // Label before the donation center name
                    },
                    ongoingSlot: {
                        title: "நடப்புக் கால இடம்", // Title for the card when there is an ongoing slot
                        noSlot: "நடப்புக் கால இடம் இல்லை", // Title for the card when there is no ongoing slot
                        slotBookedFor: "இடம் பதிவு செய்யப்பட்டுள்ளது", // Label for the booked slot details
                        at: "மணிக்கு", // Label before the time of the slot
                        cancelSlot: "இடத்தை ரத்து செய்யவும்", // Button text for canceling the slot
                        centerNameLabel: "மையத்தின் பெயர்", // Label for the center name input field
                        centerNamePlaceholder: "மையத்தின் பெயரை உள்ளிடவும்", // Placeholder for the center name input field
                        bookSlot: "ஒரு இடத்தைப் பதிவு செய்யவும்", // Button text for booking a slot
                        booking: "பதிவு செய்யப்படுகிறது...", // Button text when the booking is in progress
                        findCentersNearby: "சுற்றியுள்ள மையங்களைப் பார்", // Button text for navigating to the Find Centers page
                        alerts: {
                            bookingSuccess: "பதிவு வெற்றிகரமாக முடிந்தது!", // Alert message for a successful booking
                            bookingError: "இடத்தை பதிவு செய்யும் போது பிழை: ", // Alert message for a booking error
                        },
                    }
                }
            }
            , hi: {
                translation: {
                    greet: "नमस्ते",
                    stats: {
                        total_units: "कुल यूनिट्स",
                        total_units_desc: "पिछले महीने में 21% अधिक",
                        life_saved: "जीवन बचाया",
                        life_saved_desc: "रक्त की कमी के लिए 0% मौत",
                        blood_banks: "ब्लड बैंक",
                        blood_banks_desc: "राष्ट्र भर में सेवा कर रहे हैं",
                    },
                    hero: {
                        title: "किसी की ज़िन्दगी में नायक बनें। रक्त दान करें।",
                        description: "रक्त दान करके, आप किसी की ज़िन्दगी में नायक बन जाते हैं। आपकी एक छोटी सी दयालुता की क्रिया आपातकालीन स्थितियों में जीवन बचा सकती है, रोगियों की सहायता कर सकती है और माताओं और नवजात शिशुओं की भलाई सुनिश्चित कर सकती है। हमारे साथ जुड़ें और बदलाव लाएं—आज ही रक्त दान करें और नायक बनें।",
                        get_started: "शुरू करें"
                    },
                    navbar: {
                        home: "मुख्य पृष्ठ",
                        account: "खाता",
                        my_donations: "मेरे दान",
                        account_info: "खाता जानकारी",
                        donations: "दान",
                        center_console: "केंद्र कंसोल",
                        orders: "ऑर्डर",
                        find_donors: "डोनर ढूंढें",
                        find_centers: "केंद्र ढूंढें",
                        login: "लॉग इन",
                        register: "रजिस्टर करें",
                        logout: "लॉग आउट"
                    },
                    register: {
                        email_placeholder: "ईमेल",
                        username_placeholder: "उपयोगकर्ता नाम",
                        phone_placeholder: "फ़ोन",
                        password_placeholder: "पासवर्ड",
                        confirm_password_placeholder: "पासवर्ड फिर से लिखें",
                        role_label: "उद्देश्य",
                        donor: "डोनर",
                        hospital_admin: "रक्त अनुरोध - अस्पताल",
                        pharma_admin: "रक्त अनुरोध - फार्मा",
                        register_button: "रजिस्टर करें",
                        otp_placeholder: "ओटीपी दर्ज करें",
                        submit_otp_button: "ओटीपी जमा करें",
                        alert_password_mismatch: "पासवर्ड मेल नहीं खाता।",
                        alert_registration_success: "पंजीकरण सफल! कृपया अपने ईमेल पर भेजा गया ओटीपी दर्ज करें।",
                        alert_registration_fail: "पंजीकरण विफल रहा। कृपया पुनः प्रयास करें।",
                        alert_verification_success: "सत्यापन सफल! मुख्य पृष्ठ पर पुनर्निर्देशित कर रहे हैं।",
                        alert_otp_fail: "ओटीपी सत्यापन विफल रहा। कृपया पुनः प्रयास करें।",
                    },
                    login: {
                        email_placeholder: "ईमेल",
                        password_placeholder: "पासवर्ड",
                        remember_me_label: "मुझे याद रखें",
                        login_button: "लॉग इन करें",
                        login_success: "लॉग इन सफल!",
                        user_not_found: "उपयोगकर्ता नहीं मिला",
                        login_fail: "लॉग इन विफल रहा। कृपया पुनः प्रयास करें।",
                    },
                    orders: {
                        my_orders: "मेरे ऑर्डर",
                        create_order: "ऑर्डर बनाएं",
                        client_id: "क्लाइंट आईडी",
                        required: "आवश्यक",
                        max_quantity: "अधिकतम मात्रा",
                        order_description: "ऑर्डर विवरण",
                        optional: "वैकल्पिक",
                        order_type: "ऑर्डर प्रकार",
                        fixed: "स्थिर",
                        blood_types: "रक्त समूह का चयन करें",
                        antigen_types: "एंटीजन प्रकार चुनें",
                        blood_subtypes: "रक्त उप-प्रकार चुनें",
                        submit: "जमा करें",
                        close: "बंद करें",
                        loading: "लोड हो रहा है",
                        order_created: "ऑर्डर सफलतापूर्वक बनाया गया!",
                        amount: "राशि: ₹{{amount}}",
                        proceed_to_payment: "भुगतान गेटवे पर जाएं",
                        payment_successful: "भुगतान सफल",
                        pay_now: "अभी भुगतान करें",
                        error_submitting_order: "ऑर्डर जमा करने में त्रुटि",
                        ongoing_orders: "चल रहे ऑर्डर",
                        delivered_orders: "वितरित ऑर्डर",
                        new_order: "नया ऑर्डर",
                        payment_method: "भुगतान विधि का चयन करें",
                        make_payment: "भुगतान करें",
                        mark_as_delivered: "वितरित के रूप में चिह्नित करें",
                        order_details: "ऑर्डर विवरण",
                        description: "विवरण",
                        quantity: "मात्रा",
                        total_price: "कुल मूल्य",
                        view_more: "और देखें",
                        unit_bags: "यूनिट बैग्स",
                        blood_subtype: "रक्त उप-प्रकार",
                        blood_type: "रक्त समूह",
                        expiry: "समाप्ति तिथि",
                        is_rare: "क्या दुर्लभ है",
                        yes: "हाँ",
                        no: "नहीं",
                        error_making_payment: "आपके भुगतान को संसाधित करने में त्रुटि हुई।",
                        dashboard_title: "ऑर्डर",
                        approve_order: "स्वीकृत करें",
                        reject_order: "अस्वीकृत करें",
                        cancel_order: "ऑर्डर रद्द करें",
                        mark_as_ongoing: "चल रहे के रूप में चिह्नित करें"
                    },
                    slots: {
                        ongoingSlotsTitle: "चल रहे स्लॉट्स",
                        pendingSlotsTitle: "लंबित स्लॉट्स",
                        completedSlotsTitle: "समाप्त स्लॉट्स",
                        status: "स्थिति",
                        changeStatus: "स्थिति बदलें",
                        viewDonorInfo: "डोनर जानकारी देखें",
                        donorInfo: "डोनर जानकारी",
                        donorId: "डोनर आईडी",
                        name: "नाम",
                        email: "ईमेल",
                        phone: "फ़ोन",
                        bloodType: "रक्त समूह",
                        bloodSubtype: "रक्त उप-प्रकार",
                        close: "बंद करें",
                        BloodReceived: "रक्त प्राप्त हुआ",
                        BloodAccepted: "रक्त स्वीकृत",
                        BloodRejected: "रक्त अस्वीकृत",
                        DonorNotArrived: "डोनर नहीं पहुँचा",
                        Pending: "लंबित",
                    },
                    loggedInDevices: {
                        title: "लॉग इन डिवाइस",
                        loggedInAt: "लॉग इन किया गया",
                        deviceInfo: "डिवाइस जानकारी",
                        logoutDevice: "डिवाइस से लॉग आउट करें",
                        logoutAllDevices: "सभी डिवाइस से लॉग आउट करें",
                        browser: "ब्राउज़र पर"
                    },
                    myAccount: {
                        title: "मेरा खाता",
                        userInfoTitle: "उपयोगकर्ता खाता जानकारी",
                        resetPasswordButton: "पासवर्ड रीसेट करें",
                    },
                    userInfo: {
                        email: "ईमेल",
                        name: "नाम",
                        role: "भूमिका",
                        editButton: "संपादित करें",
                    },
                    editUserInfo: {
                        email: "ईमेल",
                        name: "नाम",
                        saveButton: "सहेजें",
                        cancelButton: "रद्द करें",
                    },
                    resetPassword: {
                        currentPassword: "वर्तमान पासवर्ड",
                        newPassword: "नया पासवर्ड",
                        confirmPassword: "नया पासवर्ड पुष्टि करें",
                        passwordLengthError: "पासवर्ड कम से कम 8 वर्णों का होना चाहिए",
                        passwordMatchError: "पासवर्ड मेल नहीं खाते",
                        saveButton: "सहेजें",
                        cancelButton: "रद्द करें",
                    },
                    footer: {
                        companyName: "लाइफफ्लो ब्लड बैंक सर्विस लिमिटेड",
                        tagline: "2024 से मानवता की सेवा में"
                    },
                    centreCard: {
                        donateHere: "यहाँ दान करें",
                        orderFromHere: "यहाँ से ऑर्डर करें",
                        away: "दूर",
                        stock: "स्टॉक",
                        from: "से",
                        to: "तक"
                    },
                    locationSearchBar: {
                        placeholder: "स्थान खोजें",
                        noLocationsFound: "कोई स्थान नहीं मिला",
                        clearButton: "साफ करें",
                    },
                    findCenters: {
                        noCentersFound: "केंद्रों को देखने के लिए खोजें",
                    },
                    myDonations: {
                        title: "मेरे दान",
                        selectedCenter: "चयनित केंद्र: {{centerName}}",
                    },
                    alerts: {
                        createDonorProfile: "कृपया आगे बढ़ने से पहले एक डोनर प्रोफ़ाइल बनाएं।",
                    },
                    donationHistory: {
                        title: "इतिहास",
                        noDonations: "अभी तक कोई दान नहीं",
                        donatedOn: "दान किया",
                        at: "पर",
                    },
                    ongoingSlot: {
                        title: "चल रहा स्लॉट",
                        noSlot: "कोई चल रहा स्लॉट नहीं",
                        slotBookedFor: "स्लॉट बुक किया गया",
                        at: "पर",
                        cancelSlot: "स्लॉट रद्द करें",
                        centerNameLabel: "केंद्र का नाम",
                        centerNamePlaceholder: "केंद्र का नाम दर्ज करें",
                        bookSlot: "स्लॉट बुक करें",
                        booking: "बुकिंग...",
                        findCentersNearby: "आस-पास के केंद्र ढूंढें",
                        alerts: {
                            bookingSuccess: "बुकिंग सफल!",
                            bookingError: "स्लॉट बुकिंग में त्रुटि: ",
                        },
                    },
                },
            }

        }

    });

export default i18n;
