/**
 * ===================================================================
 * SRIJA'S (SUGGU) SURPRISE BIRTHDAY CONFIGURATION
 * ===================================================================
 * All texts, passwords, hints, questions, love notes, and photos
 * are configured here so you can easily update them anytime!
 */

window.SURPRISE_CONFIG = {
  // Birthday Girl Details
  recipient: {
    name: "Srija",
    nickname: "suggu",
    senderName: "Tera oobyBoy ❤️",
    birthdayGreeting: "Happy Birthday in Advance Suggu! ✨🎂"
  },

  // Security / Password Gate
  auth: {
    password: "gochu", // Case-insensitive, trimmed automatically
    // The exact playful banter hints requested by user:
    hints: [
      "bakchodii nahi betee jiska hai usiko kholne de 😤",
      "aeee bhonduu itni hi buddhii hai try kr frse gochu 🧠👀",
      "gdhi hi reh jaegiii cutieee babby 🥺😂",
      "aree wo sch n the name which u hate me saying off! 😜"
    ]
  },

  // Game 1: Our Story Trivia
  trivia1: {
    title: "Level 1: Haaa to pyaree gochuu lal ✨",
    subtitle: "Dikhau zara kitna yaad hai sab kuch... No cheating baby!",
    questions: [
      {
        question: "where did we met frst bataio jara no options baby 🏫(hint sonam k sth ili thi boobyy)",
        acceptedAnswers: ["gd college", "gd cllg", "gd", "g.d. college", "g.d college", "gdcollege"],
        displayAnswer: "GD College ❤️",
        hint: "Arre jaha se sari shuruaat hui thi..."
      },
      {
        question: "meri fav flower bolio to bhondupyareeee 😉 🌸",
        acceptedAnswers: ["tulips", "tulip"],
        displayAnswer: "Tulips 🌷",
        hint: "Dutch beauty, colorful and elegant..."
      },
      {
        question: "the city we choose to settle together dkhuuu yadast hai thru sa v k nahi sb mutthi hi mar lia 🏙️",
        acceptedAnswers: ["delhi", "new delhi", "dilli"],
        displayAnswer: "Delhi 🌆",
        hint: "Dilwalo ka shehar..."
      }
    ],
    // Exact prompt when she fails 3 times on a question:
    penaltyPrompt: "nirash kr dian tune apne bachhe ko ye le and av kattiii batt mat kriooo aage se🥺💔"
  },

  // Game 2: How Well Do You Know Me
  trivia2: {
    title: "Level 2: Doremon Bnnne Wali boobbyylessbabby 😼",
    subtitle: "huuhhhhhhh bari aayi doremon bnne wali av shabit kar!",
    questions: [
      {
        question: "merii fav bike 🏍️💨",
        acceptedAnswers: ["gt 650", "gt650", "continental gt 650", "royal enfield gt 650", "continental gt"],
        displayAnswer: "GT 650 🏁",
        hint: "Twin cylinder, cafe racer beast..."
      },
      {
        question: "jab ham frst tym gd cllg m mile to hamne by-mistake twin kra the mera knsa color kapra th batio jaara color uska dkhu ktni hi achi dsi bachi hai 👕(hint dono ke jacket same color k the)",
        acceptedAnswers: ["green", "hara", "dark green", "olive green", "light green"],
        displayAnswer: "Green 💚",
        hint: "Nature wala color babu..."
      },
      {
        question: "hmari common fav food 🥟😋",
        acceptedAnswers: ["momos", "momo", "steamed momos", "fried momos"],
        displayAnswer: "Momos 🥟🤤",
        hint: "Red spicy chutney ke sath jiska craze kabhi khatam nahi hota..."
      }
    ],
    penaltyPrompt: "nirash kr dian tune apne bachhe ko ye le and av kattiii 🥺💔"
  },

  // Level 3: Mini Ludo Battle
  ludo: {
    title: "Level 3: Mini Ludo Star Championship 🎲",
    subtitle: "Suggu vs Bhondu Bot (Computer). First to take your token Home wins!",
    playerName: "Suggu 👑",
    computerName: "Bhondu Bot 🤖",
    // Configured so Srija will always win excitingly within ~1.5 minutes
    riggedForWin: true
  },

  // Level 4: Catch The Hearts Arcade
  catchHearts: {
    title: "Level 4: Catch My Heart, Suggu! 💖",
    subtitle: "Catch falling hearts & stars with your basket to fill the Love Meter to 100%!",
    targetScore: 100
  },

  // Handwritten Love Letters unlocked after completing each level
  loveNotes: [
    {
      level: 1,
      badge: "Token #1 Unlocked 📜",
      title: "For My Gochuu Lal ❤️",
      date: "Milestone 1",
      content: `Meri pyari Srija (Gochu),

'Helloooo hillooooo lolulal so avtak kaisa laga ye chutiyap ?? btw jo gana ye beackground m baj rhaa wo bas aewaii nai baj rhii uk this ki hamare liye ye mera fav song hai So babbyyy I meant every single word of this song
Mai tera rasta kv nai chor rha chaeee tu kahi v muh kala krwa k aaaa bt fr v you will find me there tere piche tere gal tere ball gichte hueee tu hazar bar bgh srija yarrr tu crore barr mujhe tere piche bhagte payegii av k lie itna av aageee bdh jaaa chal meri bobbylessbabyyy`
    },
    {
      level: 2,
      badge: "Token #2 Unlocked 💌",
      title: "Bari Aayi Doremon 🌸",
      date: "Milestone 2",
      content: `Aeee meri Suggu,

Soo Soooo you proved again ki tu hi hai asli doremon meri . That's for sure yarr chahe ktni v larai ho jayeee dono me dono ek dsre k matha phor le lkin fr v hnge ham dono hi ek dsre ke home like ki us phote hue mathee me dawa v hmhhi lgyenge,
Thanks for existing yarr mtlb look mere jindgi me toofan v tere hi laye hue hai but but mere jindgi me agr .01% v sukoon hai to wo bs tere beetlb lrne se hi hai thanks for just existing yarrr shukriya shukriyaa meri boobylessbabbyy......aage ar v hai chal aage le chaluu      `
    },
    {
      level: 3,
      badge: "Token #3 Unlocked 🎲",
      title: "Ludo Queen Suggu 👑",
      date: "Milestone 3",
      content: `Haha dekh le! 

Bhondu Bot ko bhi tune hara diya! It's for sure yarr tu sare games jeet jayegi ar ar tera mere sth hue to I can also win every little game jb tk I have a motivation to get your gall and tummy i can comeback from any war mtlb ssbki maa chdkee ke tere pass aa skta.
lkin flhal k liee ye aisa jo apna larai chal rha wo sulate haii baki av teko jitne isilie dia hai ki tu tere thre s nkle huee daant ar thre s nkal jayeee ek bar aaja tu fr pinky promise chaee kaisa v din ho kitna v thaka huahu we willnot sleep before having a ludo game ateast one to as it's ur fav game peromissseeee boobbyyy `
    },
    {
      level: 4,
      badge: "Token #4 Unlocked 🌟",
      title: "All Hearts Collected! 💖",
      date: "Milestone 4",
      content: `Suggu, meri jaan,

So finalllyyyyyyyyy boobbyyylessbabby ne sare levels cross kr lieee Kengratulation sugguuu babbuuuu , SO soooo yarr finallyy from the day one jab group me tune btaya th aise random discussion me ki tune v same arjuna wali batch li thi jee k lieee and I was like andr hi andr gandfaaarrr khussss ki chaloo av isi bhanee I will get a chance tere s gullu gullu krne k lie kyki uk tuu to thi hi mere bachaaaapan ki crus and at that tym meri ktni gand fattii thiii tv tere seee and  cominggggg all around to today jab dono ek ek dsre ko ek dsre ke chucho k lie chidaa rhee haii baith mme sath ke nudes judge kr rhee dsroo ke 😂 bt there's a long way ahead (shyad se hai toh ) wished ki piche jake tere hage ko frse saff kr pauu ar jo v av hai wo sb shii kr duuu bt khairr av jo hai aise me chlate hai na itne din se chla rhe hi thanks to you for being there hhhhh !! 
baki along this whole journey mai kab tere chakkar me par gaya pata v nai chala pata chltaa tere jaise baill ke chakkar me prta v nahiii bakii hot to hai ar av to cute v lgne hi lgee haii baki htee htee pyar to itna ho gya ki agar mai nastik hne to you would be the only goddess jiski mai pooja krta 🥲idk aage kya hga apna and kaise hga bt ham kr hi lenge kch to chootna hta to aunty thre na accept krti 😉  aur phir tere liye ek video aur grand surprise gift wait kar raha hai... Ready? ✨`
    }
  ],

  // Memory Lane (Photo Timeline)
  memoryLane: [
    {
      date: "Chapter 1",
      title: "GD College Days 🏫",
      description: "Jaha hamari kahani shuru hui. By mistake twin kiya tha green me, aur wahi se kismat ne hume jod diya!",
      placeholderEmoji: "🏫💚",
      placeholderGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(5, 150, 105, 0.2))"
    },
    {
      date: "Chapter 2",
      title: "Our Signature Craving: Momos 🥟",
      description: "Chahe kitni bhi ladai ho ya mood off ho, spicy momos ki ek plate ke baad sab theek ho jata hai.",
      placeholderEmoji: "🥟🌶️",
      placeholderGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.4), rgba(234, 88, 12, 0.2))"
    },
    {
      date: "Chapter 3",
      title: "Tulips For My Gochu 🌷",
      description: "Har flower me bas teri hi khushbu aur teri hi pyari innocence dikhti hai.",
      placeholderEmoji: "🌷✨",
      placeholderGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(219, 39, 119, 0.2))"
    },
    {
      date: "Chapter 4",
      title: "Rides & Dreams: GT 650 🏍️",
      description: "Hawa me udte baal, speed, aur tu peeche baithi hui... Pure bliss and adrenaline.",
      placeholderEmoji: "🏍️💨",
      placeholderGradient: "linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(79, 70, 229, 0.2))"
    },
    {
      date: "Chapter 5",
      title: "The Future Dream: Delhi 🌆",
      description: "Wo shehar jo hum dono ne choose kiya sath rehne ke liye... Humara chhota sa dream world.",
      placeholderEmoji: "🌆🌃",
      placeholderGradient: "linear-gradient(135deg, rgba(147, 51, 234, 0.4), rgba(126, 34, 206, 0.2))"
    },
    {
      date: "Chapter 6",
      title: "Happy Birthday Suggu 🎂",
      description: "Duniya ki sabse pyari, sabse natkhat, aur meri sabse pyari ladki ko janamdin mubarak!",
      placeholderEmoji: "🎂👑",
      placeholderGradient: "linear-gradient(135deg, rgba(244, 63, 94, 0.4), rgba(225, 29, 72, 0.2))"
    }
  ],

  // Grand Finale Settings
  finale: {
    title: "A Special Message For Srija 🎬",
    subtitle: "Watch this video note, and then unwrap your birthday surprise!",
    video: {
      src: "assets/birthday_video.mp4", // Put your video file here or paste a YouTube ID below
      youtubeId: "" // Optional YouTube ID e.g. "dQw4w9WgXcQ"
    },
    gift: {
      boxHeading: "Tap the Gift Box to Unwrap! 🎁",
      unwrappedHeading: "✨ A Special Gift Just For You! ✨",
      scratchCardPrompt: "Rub or Scratch below to reveal your surprise! ✨",
      secretGiftTitle: "🌟 SPECIAL BIRTHDAY SURPRISE 🌟",
      secretGiftCode: "SPECIAL-TRIP-WITH-ME-2026",
      secretGiftDetail: "A cozy romantic date, your favorite momos feast, and a special present waiting for you in person! 💖\n\n'Nirash nahi kia tune, ab hamesha ke liye pack ho gayi mere sath!'",
      locationHint: "P.S. Check your bag/pillow for the physical surprise box! 🤫🎁"
    }
  },

  // Audio / Music settings
  music: {
    src: "assets/song.mp3",
    title: "Romantic Starlight Melody 🎶",
    autoplayPrompt: "Click anywhere to enable magical background music 🎵"
  }
};
