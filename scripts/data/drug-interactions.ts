import { KnowledgeEntry } from "./has-guidelines";

interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity:
    | "contre-indiquée"
    | "déconseillée"
    | "précaution d'emploi"
    | "à prendre en compte";
  mechanism: string;
  recommendation: string;
}

interface DrugClassGroup {
  drugClass: string;
  interactions: DrugInteraction[];
}

function formatInteractions(interactions: DrugInteraction[]): string {
  return interactions
    .map(
      (i) =>
        `${i.drug1} + ${i.drug2} — Niveau : ${i.severity}\nMécanisme : ${i.mechanism}\nConduite à tenir : ${i.recommendation}`
    )
    .join("\n\n");
}

const drugClassGroups: DrugClassGroup[] = [
  // ──────────────────────────────────────────────
  // 1. Antihypertenseurs
  // ──────────────────────────────────────────────
  {
    drugClass: "Antihypertenseurs",
    interactions: [
      {
        drug1: "énalapril (IEC)",
        drug2: "spironolactone (diurétique épargneur de potassium)",
        severity: "précaution d'emploi",
        mechanism:
          "Risque d'hyperkaliémie potentiellement létale par addition des effets hyperkaliémiants des IEC et des diurétiques épargneurs de potassium.",
        recommendation:
          "Surveiller la kaliémie et la fonction rénale de façon rapprochée, en particulier chez le sujet âgé ou insuffisant rénal. Kaliémie dans la semaine suivant l'instauration.",
      },
      {
        drug1: "ramipril (IEC)",
        drug2: "losartan (ARA2)",
        severity: "contre-indiquée",
        mechanism:
          "Le double blocage du système rénine-angiotensine-aldostérone (SRAA) par l'association IEC + ARA2 augmente le risque d'hypotension, d'hyperkaliémie et d'insuffisance rénale aiguë sans bénéfice cardiovasculaire supplémentaire démontré.",
        recommendation:
          "Ne jamais associer un IEC et un ARA2. Choisir l'une ou l'autre classe thérapeutique. Exception très encadrée : néphropathie diabétique sous surveillance néphrologique stricte.",
      },
      {
        drug1: "périndopril (IEC)",
        drug2: "ibuprofène (AINS)",
        severity: "précaution d'emploi",
        mechanism:
          "Les AINS inhibent la synthèse des prostaglandines rénales vasodilatatrices, réduisant l'effet antihypertenseur des IEC et augmentant le risque d'insuffisance rénale aiguë fonctionnelle, notamment en cas de déshydratation.",
        recommendation:
          "Hydrater le patient, surveiller la fonction rénale en début de traitement. Limiter la durée de prescription de l'AINS. Éviter l'association chez l'insuffisant rénal.",
      },
      {
        drug1: "amlodipine (inhibiteur calcique)",
        drug2: "simvastatine (statine)",
        severity: "précaution d'emploi",
        mechanism:
          "L'amlodipine inhibe modérément le CYP3A4, augmentant les concentrations plasmatiques de simvastatine et le risque de rhabdomyolyse dose-dépendant.",
        recommendation:
          "Ne pas dépasser 20 mg/jour de simvastatine en cas d'association avec l'amlodipine. Préférer l'atorvastatine ou la rosuvastatine, moins sensibles à cette interaction.",
      },
      {
        drug1: "bisoprolol (bêtabloquant)",
        drug2: "verapamil (inhibiteur calcique bradycardisant)",
        severity: "contre-indiquée",
        mechanism:
          "Effet additif sur la conduction auriculo-ventriculaire et la fréquence cardiaque : risque de bradycardie sévère, de trouble de conduction (BAV) et de défaillance cardiaque.",
        recommendation:
          "Association contre-indiquée. Si un traitement antihypertenseur est nécessaire, préférer un inhibiteur calcique dihydropyridinique (amlodipine, nifédipine) qui n'a pas d'effet bradycardisant significatif.",
      },
      {
        drug1: "aténolol (bêtabloquant)",
        drug2: "insuline",
        severity: "précaution d'emploi",
        mechanism:
          "Les bêtabloquants masquent les signes adrénergiques de l'hypoglycémie (tachycardie, tremblements) et peuvent prolonger et aggraver l'hypoglycémie en inhibant la glycogénolyse hépatique.",
        recommendation:
          "Prévenir le patient du risque de masquage des symptômes d'hypoglycémie. Renforcer l'autosurveillance glycémique. Préférer les bêtabloquants cardiosélectifs (bisoprolol) qui masquent moins les signes.",
      },
      {
        drug1: "furosémide (diurétique de l'anse)",
        drug2: "gentamicine (aminoside)",
        severity: "déconseillée",
        mechanism:
          "Addition de la néphrotoxicité et de l'ototoxicité des deux médicaments. Le furosémide aggrave la toxicité des aminosides en augmentant leurs concentrations tubulaires par déshydratation.",
        recommendation:
          "Association déconseillée. Si elle est indispensable, assurer une hydratation correcte, surveiller la fonction rénale et adapter les doses d'aminosides par dosages sériques (pics et vallées).",
      },
      {
        drug1: "hydrochlorothiazide (diurétique thiazidique)",
        drug2: "lithium",
        severity: "déconseillée",
        mechanism:
          "Les diurétiques thiazidiques diminuent la clairance rénale du lithium par augmentation de la réabsorption tubulaire proximale du sodium et du lithium, entraînant un risque de surdosage en lithium.",
        recommendation:
          "Association déconseillée. Si indispensable, surveillance rapprochée de la lithiémie et adaptation posologique. Préférer un antihypertenseur d'une autre classe (inhibiteur calcique).",
      },
      {
        drug1: "propranolol (bêtabloquant)",
        drug2: "adrénaline (épinéphrine)",
        severity: "précaution d'emploi",
        mechanism:
          "Sous bêtabloquant non sélectif, l'adrénaline peut provoquer une crise hypertensive par stimulation alpha-adrénergique non compensée et une bradycardie réflexe sévère.",
        recommendation:
          "En cas de réaction anaphylactique chez un patient sous bêtabloquant non sélectif, utiliser le glucagon en complément de l'adrénaline. Prévenir le patient de ce risque.",
      },
      {
        drug1: "valsartan (ARA2)",
        drug2: "potassium (supplémentation)",
        severity: "précaution d'emploi",
        mechanism:
          "Les ARA2 diminuent la sécrétion d'aldostérone, réduisant l'excrétion rénale du potassium. L'ajout d'une supplémentation potassique expose à une hyperkaliémie sévère.",
        recommendation:
          "Éviter la supplémentation potassique sauf en cas d'hypokaliémie documentée. Contrôle de la kaliémie avant et après introduction.",
      },
      {
        drug1: "nifédipine (inhibiteur calcique)",
        drug2: "rifampicine (antituberculeux)",
        severity: "déconseillée",
        mechanism:
          "La rifampicine est un puissant inducteur du CYP3A4 et de la glycoprotéine P, diminuant fortement les concentrations plasmatiques de la nifédipine (jusqu'à 90 %), avec perte de l'effet antihypertenseur.",
        recommendation:
          "Éviter l'association. Si un antihypertenseur est nécessaire pendant un traitement par rifampicine, préférer un diurétique ou un IEC moins affecté par l'induction enzymatique.",
      },
      {
        drug1: "irbésartan (ARA2)",
        drug2: "diclofénac (AINS)",
        severity: "précaution d'emploi",
        mechanism:
          "Les AINS réduisent l'effet antihypertenseur des ARA2 par inhibition de la synthèse des prostaglandines rénales. Risque additionnel d'insuffisance rénale aiguë et d'hyperkaliémie (triple whammy avec diurétique associé).",
        recommendation:
          "Surveiller la pression artérielle, la fonction rénale et la kaliémie. Éviter l'AINS si possible ou limiter la durée. Hydrater le patient.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. Antidiabétiques
  // ──────────────────────────────────────────────
  {
    drugClass: "Antidiabétiques",
    interactions: [
      {
        drug1: "metformine",
        drug2: "produits de contraste iodés",
        severity: "précaution d'emploi",
        mechanism:
          "Les produits de contraste iodés peuvent provoquer une insuffisance rénale aiguë, entraînant une accumulation de metformine et un risque d'acidose lactique potentiellement fatale.",
        recommendation:
          "Arrêter la metformine 48 heures avant l'examen avec injection de produit de contraste iodé. Ne reprendre qu'après vérification de la fonction rénale (créatinine normale) 48 heures après l'examen.",
      },
      {
        drug1: "metformine",
        drug2: "alcool (éthanol)",
        severity: "déconseillée",
        mechanism:
          "L'alcool potentialise le risque d'acidose lactique de la metformine en inhibant la néoglucogenèse hépatique et en favorisant la production de lactate.",
        recommendation:
          "Éviter la consommation excessive d'alcool et le jeûne prolongé sous metformine. Informer le patient des signes d'acidose lactique (asthénie, douleurs abdominales, crampes musculaires).",
      },
      {
        drug1: "gliclazide (sulfamide hypoglycémiant)",
        drug2: "fluconazole (antifongique azolé)",
        severity: "précaution d'emploi",
        mechanism:
          "Le fluconazole inhibe le CYP2C9, enzyme principale du métabolisme du gliclazide, augmentant ses concentrations plasmatiques et le risque d'hypoglycémie sévère.",
        recommendation:
          "Renforcer l'autosurveillance glycémique pendant et après le traitement antifongique. Adapter la posologie du sulfamide si nécessaire. Prévenir le patient du risque hypoglycémique.",
      },
      {
        drug1: "glibenclamide (sulfamide hypoglycémiant)",
        drug2: "miconazole (antifongique)",
        severity: "contre-indiquée",
        mechanism:
          "Le miconazole, même en gel buccal, inhibe fortement le CYP2C9, entraînant une augmentation majeure des concentrations de glibenclamide avec risque d'hypoglycémie sévère et prolongée.",
        recommendation:
          "Association contre-indiquée. Utiliser un antifongique d'une autre classe ou remplacer le sulfamide hypoglycémiant par un autre antidiabétique pendant la durée du traitement antifongique.",
      },
      {
        drug1: "sitagliptine (inhibiteur DPP-4)",
        drug2: "insuline",
        severity: "précaution d'emploi",
        mechanism:
          "L'association d'un inhibiteur de la DPP-4 et de l'insuline augmente le risque d'hypoglycémie par potentialisation de l'effet insulinosécréteur incrétinique et de l'apport exogène d'insuline.",
        recommendation:
          "Réduire la dose d'insuline de 10 à 20 % lors de l'ajout de la sitagliptine. Renforcer la surveillance glycémique. Éduquer le patient à la reconnaissance des hypoglycémies.",
      },
      {
        drug1: "metformine",
        drug2: "ciprofloxacine (fluoroquinolone)",
        severity: "précaution d'emploi",
        mechanism:
          "Les fluoroquinolones peuvent provoquer des dysgylcémies (hypo- et hyperglycémies) chez les patients diabétiques, en particulier sous metformine ou sulfamides hypoglycémiants.",
        recommendation:
          "Surveiller la glycémie de manière rapprochée pendant le traitement par ciprofloxacine. Informer le patient du risque de déséquilibre glycémique.",
      },
      {
        drug1: "insuline",
        drug2: "corticoïdes (prednisolone, dexaméthasone)",
        severity: "précaution d'emploi",
        mechanism:
          "Les corticoïdes provoquent une insulino-résistance par stimulation de la néoglucogenèse hépatique et diminution de l'utilisation périphérique du glucose, déséquilibrant le diabète.",
        recommendation:
          "Renforcer la surveillance glycémique dès l'instauration de la corticothérapie. Adapter les doses d'insuline (augmentation souvent nécessaire de 20 à 50 %). Réévaluer à l'arrêt des corticoïdes.",
      },
      {
        drug1: "gliclazide (sulfamide hypoglycémiant)",
        drug2: "alcool (éthanol)",
        severity: "déconseillée",
        mechanism:
          "L'alcool potentialise l'effet hypoglycémiant des sulfamides par inhibition de la néoglucogenèse hépatique. De plus, il peut provoquer un effet antabuse (flush, nausées) avec certains sulfamides.",
        recommendation:
          "Déconseiller la consommation d'alcool, surtout à jeun. Informer le patient du risque d'hypoglycémie sévère et prolongée.",
      },
      {
        drug1: "metformine",
        drug2: "furosémide (diurétique de l'anse)",
        severity: "précaution d'emploi",
        mechanism:
          "Le furosémide peut altérer la fonction rénale par déshydratation, favorisant l'accumulation de metformine et le risque d'acidose lactique. Le furosémide augmente par ailleurs les concentrations plasmatiques de metformine.",
        recommendation:
          "Surveiller la fonction rénale et maintenir une hydratation adéquate. Adapter la posologie de la metformine en cas d'altération du DFG.",
      },
      {
        drug1: "glibenclamide (sulfamide hypoglycémiant)",
        drug2: "trimethoprime-sulfaméthoxazole",
        severity: "précaution d'emploi",
        mechanism:
          "Le sulfaméthoxazole inhibe le CYP2C9, augmentant les concentrations plasmatiques du glibenclamide. Le triméthoprime peut également potentialiser l'effet hypoglycémiant.",
        recommendation:
          "Surveillance glycémique renforcée. Réduire éventuellement la dose du sulfamide hypoglycémiant pendant l'antibiothérapie.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. Anticoagulants / Antiagrégants
  // ──────────────────────────────────────────────
  {
    drugClass: "Anticoagulants et Antiagrégants plaquettaires",
    interactions: [
      {
        drug1: "warfarine (AVK)",
        drug2: "aspirine",
        severity: "déconseillée",
        mechanism:
          "L'aspirine à doses anti-inflammatoires (≥ 500 mg) potentialise l'effet anticoagulant des AVK par inhibition de la fonction plaquettaire et par déplacement de la liaison aux protéines plasmatiques, augmentant le risque hémorragique.",
        recommendation:
          "Association déconseillée aux doses anti-inflammatoires ou antalgiques (≥ 500 mg). À doses antiagrégantes (75-100 mg), association possible sous surveillance stricte de l'INR avec indication validée (prothèse valvulaire mécanique, SCA).",
      },
      {
        drug1: "acénocoumarol (AVK)",
        drug2: "amiodarone",
        severity: "précaution d'emploi",
        mechanism:
          "L'amiodarone inhibe le CYP2C9 et le CYP1A2, diminuant le métabolisme hépatique des AVK. L'effet est retardé (2 à 8 semaines après l'introduction) et persiste longtemps après l'arrêt (demi-vie très longue de l'amiodarone).",
        recommendation:
          "Réduire la dose d'AVK de 30 à 50 % dès l'introduction de l'amiodarone. Contrôle hebdomadaire de l'INR pendant les 2 premiers mois, puis mensuel. Surveillance prolongée à l'arrêt.",
      },
      {
        drug1: "warfarine (AVK)",
        drug2: "rifampicine (antituberculeux)",
        severity: "contre-indiquée",
        mechanism:
          "La rifampicine est un puissant inducteur enzymatique (CYP2C9, CYP3A4, CYP1A2), diminuant drastiquement les concentrations d'AVK avec perte de l'effet anticoagulant et risque thrombotique majeur.",
        recommendation:
          "Association contre-indiquée dans la mesure du possible. Si indispensable, contrôle très rapproché de l'INR (2 fois par semaine) avec augmentation importante des doses d'AVK. Réévaluer à l'arrêt de la rifampicine (risque hémorragique par surdosage).",
      },
      {
        drug1: "rivaroxaban (AOD)",
        drug2: "kétoconazole (antifongique azolé)",
        severity: "contre-indiquée",
        mechanism:
          "Le kétoconazole est un inhibiteur puissant du CYP3A4 et de la glycoprotéine P, augmentant de façon très importante les concentrations plasmatiques du rivaroxaban (jusqu'à 2,5 fois) avec risque hémorragique majeur.",
        recommendation:
          "Association contre-indiquée. Utiliser un antifongique non inhibiteur du CYP3A4 ou substituer l'anticoagulant par une héparine pendant la durée du traitement antifongique.",
      },
      {
        drug1: "apixaban (AOD)",
        drug2: "carbamazépine (antiépileptique)",
        severity: "déconseillée",
        mechanism:
          "La carbamazépine est un puissant inducteur du CYP3A4 et de la glycoprotéine P, diminuant significativement les concentrations d'apixaban avec risque de perte de l'efficacité anticoagulante et d'accident thromboembolique.",
        recommendation:
          "Association déconseillée. Si un anticoagulant est nécessaire sous carbamazépine, préférer un AVK avec surveillance de l'INR.",
      },
      {
        drug1: "héparine (HNF ou HBPM)",
        drug2: "aspirine",
        severity: "précaution d'emploi",
        mechanism:
          "L'aspirine inhibe l'agrégation plaquettaire et augmente le risque hémorragique de l'héparine par un mécanisme complémentaire. Le risque est proportionnel à la dose d'aspirine.",
        recommendation:
          "Association possible à dose antiagrégante (75-100 mg) dans les syndromes coronariens aigus sous surveillance clinique étroite. Éviter les AINS à doses anti-inflammatoires.",
      },
      {
        drug1: "clopidogrel",
        drug2: "oméprazole (IPP)",
        severity: "déconseillée",
        mechanism:
          "L'oméprazole inhibe le CYP2C19, enzyme nécessaire à la transformation du clopidogrel (prodrogue) en son métabolite actif, diminuant ainsi l'effet antiagrégant plaquettaire.",
        recommendation:
          "Remplacer l'oméprazole par le pantoprazole, qui a une interaction moindre avec le CYP2C19. Éviter également l'ésoméprazole. Évaluer la nécessité du traitement par IPP.",
      },
      {
        drug1: "warfarine (AVK)",
        drug2: "métronidazole (antibiotique)",
        severity: "précaution d'emploi",
        mechanism:
          "Le métronidazole inhibe le CYP2C9, principal enzyme du métabolisme de la S-warfarine, augmentant l'effet anticoagulant et le risque hémorragique.",
        recommendation:
          "Contrôler l'INR 3 à 4 jours après le début du métronidazole et adapter la dose d'AVK. Nouveau contrôle après l'arrêt de l'antibiotique.",
      },
      {
        drug1: "aspirine",
        drug2: "clopidogrel",
        severity: "à prendre en compte",
        mechanism:
          "La double antiagrégation plaquettaire (DAPT) augmente le risque hémorragique, notamment gastro-intestinal et intracrânien, par inhibition de deux voies complémentaires de l'agrégation plaquettaire.",
        recommendation:
          "Association justifiée dans les syndromes coronariens aigus et après pose de stent coronaire. Limiter la durée selon les recommandations (6 à 12 mois). Associer un IPP (pantoprazole) en cas de risque gastro-intestinal.",
      },
      {
        drug1: "warfarine (AVK)",
        drug2: "paracétamol",
        severity: "précaution d'emploi",
        mechanism:
          "Le paracétamol à doses élevées (≥ 2 g/jour pendant plusieurs jours) peut augmenter l'INR chez les patients sous AVK, probablement par inhibition du métabolisme des facteurs de coagulation vitamine K-dépendants.",
        recommendation:
          "Préférer le paracétamol en première intention antalgique mais ne pas dépasser 2 g/jour. Contrôler l'INR si traitement prolongé (> 4 jours) à doses maximales.",
      },
      {
        drug1: "acénocoumarol (AVK)",
        drug2: "fluconazole (antifongique azolé)",
        severity: "contre-indiquée",
        mechanism:
          "Le fluconazole est un puissant inhibiteur du CYP2C9, augmentant de façon très significative les concentrations d'AVK avec risque hémorragique grave (INR > 5).",
        recommendation:
          "Association contre-indiquée si possible. Si indispensable, réduire les doses d'AVK de moitié et contrôler l'INR tous les 2-3 jours jusqu'à stabilisation.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. Anti-inflammatoires
  // ──────────────────────────────────────────────
  {
    drugClass: "Anti-inflammatoires",
    interactions: [
      {
        drug1: "ibuprofène (AINS)",
        drug2: "aspirine faible dose (antiagrégant)",
        severity: "précaution d'emploi",
        mechanism:
          "L'ibuprofène bloque de façon réversible l'accès de l'aspirine au site actif de la COX-1 plaquettaire, diminuant l'effet antiagrégant de l'aspirine et le bénéfice cardiovasculaire associé.",
        recommendation:
          "Prendre l'aspirine au moins 30 minutes avant ou 8 heures après l'ibuprofène. Préférer le paracétamol comme antalgique chez les patients sous aspirine faible dose.",
      },
      {
        drug1: "diclofénac (AINS)",
        drug2: "lithium",
        severity: "déconseillée",
        mechanism:
          "Les AINS diminuent la filtration glomérulaire et augmentent la réabsorption tubulaire du lithium, entraînant une augmentation des concentrations plasmatiques de lithium pouvant atteindre des niveaux toxiques.",
        recommendation:
          "Association déconseillée. Si indispensable, surveiller la lithiémie de façon rapprochée et adapter la posologie du lithium. Préférer le paracétamol ou un antalgique non AINS.",
      },
      {
        drug1: "kétoprofène (AINS)",
        drug2: "méthotrexate (> 20 mg/semaine)",
        severity: "contre-indiquée",
        mechanism:
          "Les AINS diminuent la sécrétion tubulaire rénale du méthotrexate, augmentant ses concentrations plasmatiques de façon majeure avec risque de toxicité sévère (pancytopénie, mucite, insuffisance rénale).",
        recommendation:
          "Association contre-indiquée avec le méthotrexate à doses oncologiques (> 20 mg/semaine). Aux doses rhumatologiques (≤ 20 mg/semaine), précaution d'emploi avec surveillance de la NFS et de la fonction rénale.",
      },
      {
        drug1: "ibuprofène (AINS)",
        drug2: "warfarine (AVK)",
        severity: "déconseillée",
        mechanism:
          "Les AINS augmentent le risque hémorragique des AVK par inhibition de la fonction plaquettaire (COX-1), toxicité gastrique directe et déplacement de l'AVK de sa liaison à l'albumine.",
        recommendation:
          "Éviter l'association. Si nécessaire, préférer un traitement court, à la plus faible dose efficace, avec un IPP en protection gastrique et un contrôle rapproché de l'INR.",
      },
      {
        drug1: "prednisolone (corticoïde)",
        drug2: "AINS (ibuprofène, diclofénac)",
        severity: "précaution d'emploi",
        mechanism:
          "Association synergique sur le risque gastro-intestinal : les corticoïdes diminuent la synthèse de mucus gastrique et les AINS inhibent les prostaglandines cytoprotectrices, multipliant le risque d'ulcère et de perforation.",
        recommendation:
          "Éviter l'association dans la mesure du possible. Si nécessaire, associer systématiquement un IPP (oméprazole, pantoprazole) en protection gastrique. Surveiller les signes de saignement digestif.",
      },
      {
        drug1: "dexaméthasone (corticoïde)",
        drug2: "anticoagulants oraux (AVK)",
        severity: "précaution d'emploi",
        mechanism:
          "Les corticoïdes à fortes doses modifient le métabolisme des facteurs de coagulation et potentialisent le risque de fragilité vasculaire, augmentant le risque hémorragique sous AVK. De plus, ils peuvent induire le métabolisme des AVK.",
        recommendation:
          "Contrôle de l'INR 3 à 5 jours après toute modification de la corticothérapie (introduction, modification de dose, arrêt). Adapter la posologie de l'AVK en conséquence.",
      },
      {
        drug1: "diclofénac (AINS)",
        drug2: "furosémide (diurétique de l'anse)",
        severity: "précaution d'emploi",
        mechanism:
          "Les AINS diminuent l'effet natriurétique du furosémide par inhibition de la synthèse des prostaglandines rénales. Risque d'insuffisance rénale aiguë fonctionnelle en cas de déshydratation (triple whammy avec IEC/ARA2).",
        recommendation:
          "Hydrater le patient. Surveiller la fonction rénale et le poids en début d'association. Éviter le triple association AINS + diurétique + IEC/ARA2.",
      },
      {
        drug1: "ibuprofène (AINS)",
        drug2: "ciclosporine (immunosuppresseur)",
        severity: "précaution d'emploi",
        mechanism:
          "Les AINS augmentent la néphrotoxicité de la ciclosporine par vasoconstriction de l'artériole afférente glomérulaire, s'ajoutant à la vasoconstriction de l'artériole afférente induite par la ciclosporine.",
        recommendation:
          "Surveiller étroitement la fonction rénale et les concentrations de ciclosporine. Préférer le paracétamol comme antalgique. Si un AINS est nécessaire, utiliser la durée et la dose minimales efficaces.",
      },
      {
        drug1: "paracétamol",
        drug2: "alcool (éthanol chronique)",
        severity: "précaution d'emploi",
        mechanism:
          "L'alcoolisme chronique induit le CYP2E1, augmentant la formation du métabolite hépatotoxique du paracétamol (NAPQI) tout en diminuant les réserves de glutathion hépatique, majorant le risque d'hépatotoxicité.",
        recommendation:
          "Ne pas dépasser 2 g/jour de paracétamol chez le patient alcoolique chronique. Informer le patient du risque d'hépatotoxicité. Surveiller le bilan hépatique.",
      },
      {
        drug1: "kétoprofène (AINS)",
        drug2: "spironolactone (diurétique)",
        severity: "précaution d'emploi",
        mechanism:
          "Les AINS diminuent l'effet diurétique et natriurétique de la spironolactone. De plus, l'association augmente le risque d'hyperkaliémie et d'insuffisance rénale fonctionnelle.",
        recommendation:
          "Surveiller la kaliémie et la fonction rénale. Assurer une bonne hydratation. Préférer le paracétamol comme antalgique de première intention.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. Antibiotiques
  // ──────────────────────────────────────────────
  {
    drugClass: "Antibiotiques",
    interactions: [
      {
        drug1: "amoxicilline",
        drug2: "méthotrexate",
        severity: "précaution d'emploi",
        mechanism:
          "L'amoxicilline diminue la sécrétion tubulaire rénale du méthotrexate, augmentant ses concentrations plasmatiques et le risque de toxicité hématologique et muqueuse.",
        recommendation:
          "Surveillance clinique et biologique renforcée (NFS, fonction rénale, transaminases) pendant et après l'antibiothérapie. Adapter la dose de méthotrexate si nécessaire.",
      },
      {
        drug1: "amoxicilline + acide clavulanique",
        drug2: "allopurinol",
        severity: "à prendre en compte",
        mechanism:
          "L'association amoxicilline-allopurinol augmente le risque d'éruptions cutanées (exanthème maculopapuleux) par un mécanisme immunologique non complètement élucidé.",
        recommendation:
          "Informer le patient du risque de rash cutané. Ne pas confondre avec une allergie vraie aux pénicillines. En cas d'éruption, réévaluer l'indication de l'antibiothérapie.",
      },
      {
        drug1: "ciprofloxacine (fluoroquinolone)",
        drug2: "théophylline",
        severity: "précaution d'emploi",
        mechanism:
          "La ciprofloxacine inhibe le CYP1A2, principal enzyme du métabolisme de la théophylline, augmentant ses concentrations plasmatiques avec risque de toxicité (convulsions, troubles du rythme cardiaque).",
        recommendation:
          "Doser la théophyllinémie avant et pendant le traitement par ciprofloxacine. Réduire la dose de théophylline de 30 à 50 %. Surveiller les signes de surdosage (nausées, tremblements, tachycardie).",
      },
      {
        drug1: "azithromycine (macrolide)",
        drug2: "digoxine",
        severity: "précaution d'emploi",
        mechanism:
          "L'azithromycine augmente l'absorption intestinale de la digoxine en réduisant la flore bactérienne intestinale qui inactive normalement une partie de la digoxine. De plus, elle inhibe la glycoprotéine P intestinale.",
        recommendation:
          "Surveiller la digoxinémie et les signes de surdosage digitalique (nausées, troubles visuels, bradycardie, troubles du rythme). Adapter la posologie de la digoxine.",
      },
      {
        drug1: "métronidazole",
        drug2: "alcool (éthanol)",
        severity: "déconseillée",
        mechanism:
          "Le métronidazole provoque un effet antabuse par inhibition de l'aldéhyde déshydrogénase, entraînant une accumulation d'acétaldéhyde avec flush cutané, nausées, vomissements, tachycardie et hypotension.",
        recommendation:
          "Proscrire toute consommation d'alcool pendant le traitement et les 48 heures suivant l'arrêt du métronidazole. Informer le patient de cette interaction, y compris pour les médicaments contenant de l'alcool.",
      },
      {
        drug1: "rifampicine (antituberculeux / antibiotique)",
        drug2: "contraceptifs oraux (œstro-progestatifs)",
        severity: "contre-indiquée",
        mechanism:
          "La rifampicine est un inducteur enzymatique majeur (CYP3A4, CYP2C8), réduisant les concentrations d'éthinylestradiol et de progestatif de 40 à 60 %, entraînant une perte d'efficacité contraceptive.",
        recommendation:
          "Utiliser une contraception non hormonale (dispositif intra-utérin au cuivre) pendant le traitement par rifampicine et 2 mois après son arrêt. La pilule seule est insuffisante.",
      },
      {
        drug1: "ciprofloxacine (fluoroquinolone)",
        drug2: "sels de fer, calcium, magnésium, aluminium (antiacides)",
        severity: "précaution d'emploi",
        mechanism:
          "Les cations polyvalents (Fe²⁺, Ca²⁺, Mg²⁺, Al³⁺) forment des complexes insolubles (chélation) avec la ciprofloxacine dans le tractus gastro-intestinal, diminuant de 50 à 90 % son absorption et son efficacité.",
        recommendation:
          "Respecter un intervalle de 2 heures minimum entre la prise de ciprofloxacine et celle des produits contenant des cations polyvalents (antiacides, suppléments en fer ou calcium). Prendre la ciprofloxacine en premier.",
      },
      {
        drug1: "azithromycine (macrolide)",
        drug2: "amiodarone",
        severity: "déconseillée",
        mechanism:
          "Les macrolides et l'amiodarone allongent tous deux l'intervalle QT, avec risque d'addition des effets et de survenue de torsades de pointes, trouble du rythme ventriculaire potentiellement fatal.",
        recommendation:
          "Éviter l'association. Si indispensable, réaliser un ECG avant et pendant le traitement, surveiller la kaliémie (corriger toute hypokaliémie). Préférer un antibiotique sans effet sur le QT.",
      },
      {
        drug1: "métronidazole",
        drug2: "lithium",
        severity: "précaution d'emploi",
        mechanism:
          "Le métronidazole diminue la clairance rénale du lithium, augmentant ses concentrations plasmatiques avec risque de toxicité (tremblements, confusion, polyurie, insuffisance rénale).",
        recommendation:
          "Surveiller la lithiémie au début et à la fin du traitement par métronidazole. Adapter la posologie du lithium si nécessaire.",
      },
      {
        drug1: "rifampicine",
        drug2: "méthadone (opioïde de substitution)",
        severity: "précaution d'emploi",
        mechanism:
          "La rifampicine induit le CYP3A4 et le CYP2B6, accélérant le métabolisme de la méthadone et diminuant ses concentrations plasmatiques de 33 à 68 %, pouvant déclencher un syndrome de sevrage aux opioïdes.",
        recommendation:
          "Augmenter progressivement les doses de méthadone sous surveillance clinique. Surveiller les signes de sevrage. Réévaluer la posologie à l'arrêt de la rifampicine (risque de surdosage).",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. Psychotropes
  // ──────────────────────────────────────────────
  {
    drugClass: "Psychotropes",
    interactions: [
      {
        drug1: "fluoxétine (ISRS)",
        drug2: "tramadol (opioïde)",
        severity: "déconseillée",
        mechanism:
          "Double risque : la fluoxétine inhibe le CYP2D6, diminuant l'activation du tramadol en O-desméthyltramadol (métabolite actif) et réduisant l'efficacité analgésique. De plus, risque de syndrome sérotoninergique par addition des effets sérotoninergiques.",
        recommendation:
          "Éviter l'association. Si un antalgique de palier 2 est nécessaire, préférer la codéine (avec les mêmes précautions CYP2D6) ou le paracétamol seul. Surveiller les signes de syndrome sérotoninergique.",
      },
      {
        drug1: "paroxétine (ISRS)",
        drug2: "tamoxifène (anti-œstrogène)",
        severity: "contre-indiquée",
        mechanism:
          "La paroxétine est un puissant inhibiteur du CYP2D6, empêchant la transformation du tamoxifène (prodrogue) en endoxifène (métabolite actif), réduisant significativement son efficacité anticancéreuse.",
        recommendation:
          "Association contre-indiquée. Si un antidépresseur est nécessaire chez une patiente sous tamoxifène, préférer la venlafaxine ou le citalopram qui inhibent moins le CYP2D6.",
      },
      {
        drug1: "sertraline (ISRS)",
        drug2: "IMAO (sélégiline, moclobémide)",
        severity: "contre-indiquée",
        mechanism:
          "L'association d'un ISRS et d'un IMAO provoque un syndrome sérotoninergique potentiellement fatal par accumulation massive de sérotonine synaptique (agitation, hyperthermie, myoclonies, rigidité, instabilité autonome).",
        recommendation:
          "Association absolument contre-indiquée. Respecter un délai de washout de 2 semaines après l'arrêt de l'ISRS avant d'introduire un IMAO (5 semaines pour la fluoxétine du fait de sa longue demi-vie). Délai de 2 semaines après l'arrêt de l'IMAO avant d'introduire un ISRS.",
      },
      {
        drug1: "diazépam (benzodiazépine)",
        drug2: "morphine (opioïde)",
        severity: "précaution d'emploi",
        mechanism:
          "L'association benzodiazépine-opioïde entraîne une potentialisation de la dépression du système nerveux central avec risque de dépression respiratoire sévère, de sédation excessive et de décès, surtout chez le sujet âgé.",
        recommendation:
          "Limiter les doses et la durée de l'association au strict minimum. Surveiller la fréquence respiratoire et le niveau de sédation. Informer le patient et son entourage des signes de dépression respiratoire.",
      },
      {
        drug1: "escitalopram (ISRS)",
        drug2: "amiodarone",
        severity: "déconseillée",
        mechanism:
          "Les deux médicaments allongent l'intervalle QT par des mécanismes différents (bloc des canaux potassiques hERG). L'addition des effets augmente le risque de torsades de pointes.",
        recommendation:
          "Éviter l'association. Si nécessaire, ECG avant et pendant le traitement, surveillance de la kaliémie et de la magnésémie. Préférer un antidépresseur sans effet sur le QT (mirtazapine).",
      },
      {
        drug1: "alprazolam (benzodiazépine)",
        drug2: "kétoconazole (antifongique azolé)",
        severity: "précaution d'emploi",
        mechanism:
          "Le kétoconazole inhibe fortement le CYP3A4, augmentant les concentrations plasmatiques d'alprazolam (multiplié par 3-4) et renforçant sa sédation et ses effets indésirables.",
        recommendation:
          "Réduire la dose d'alprazolam de moitié. Surveiller la sédation et les troubles cognitifs. Préférer une benzodiazépine métabolisée par glucuroconjugaison (lorazépam, oxazépam) non affectée par cette interaction.",
      },
      {
        drug1: "halopéridol (antipsychotique)",
        drug2: "lévodopa (antiparkinsonien)",
        severity: "contre-indiquée",
        mechanism:
          "Antagonisme pharmacodynamique réciproque : l'halopéridol bloque les récepteurs dopaminergiques D2 que la lévodopa cherche à stimuler, annulant l'effet antiparkinsonien et aggravant les symptômes extrapyramidaux.",
        recommendation:
          "Association contre-indiquée chez le patient parkinsonien. Si un antipsychotique est nécessaire, utiliser uniquement la clozapine ou la quétiapine qui ont un moindre risque d'aggravation des symptômes parkinsoniens.",
      },
      {
        drug1: "lithium",
        drug2: "carbamazépine",
        severity: "précaution d'emploi",
        mechanism:
          "L'association augmente le risque de neurotoxicité (ataxie, tremblements, nystagmus, confusion) même avec des concentrations plasmatiques dans les zones thérapeutiques de chaque médicament, par synergie de leurs effets neurologiques.",
        recommendation:
          "Surveillance clinique et neurologique rapprochée. Doser la lithiémie et la carbamazépinémie. Informer le patient des signes de neurotoxicité. Commencer à doses faibles.",
      },
      {
        drug1: "valproate (antiépileptique / thymorégulateur)",
        drug2: "carbamazépine",
        severity: "précaution d'emploi",
        mechanism:
          "La carbamazépine induit le métabolisme du valproate (diminution de ses concentrations) tandis que le valproate inhibe l'époxyde hydrolase, augmentant les concentrations du métabolite actif et toxique de la carbamazépine (carbamazépine-10,11-époxyde).",
        recommendation:
          "Doser les deux médicaments et le métabolite époxyde de la carbamazépine. Adapter les posologies. Surveiller les signes de toxicité de la carbamazépine (diplopie, ataxie, vertiges).",
      },
      {
        drug1: "rispéridone (antipsychotique)",
        drug2: "fluoxétine (ISRS)",
        severity: "précaution d'emploi",
        mechanism:
          "La fluoxétine inhibe le CYP2D6, principal enzyme du métabolisme de la rispéridone, augmentant ses concentrations plasmatiques et le risque d'effets indésirables (syndrome extrapyramidal, hyperprolactinémie, sédation).",
        recommendation:
          "Réduire la dose de rispéridone lors de l'introduction de la fluoxétine. Surveiller les effets extrapyramidaux et la prolactinémie.",
      },
      {
        drug1: "olanzapine (antipsychotique)",
        drug2: "tabac (fumée de cigarette)",
        severity: "précaution d'emploi",
        mechanism:
          "Les hydrocarbures aromatiques polycycliques contenus dans la fumée de tabac induisent le CYP1A2, accélérant le métabolisme de l'olanzapine et diminuant ses concentrations plasmatiques de 30 à 40 %.",
        recommendation:
          "Ajuster la dose d'olanzapine en cas de modification du tabagisme. Augmenter les doses chez le fumeur. Attention : réduire les doses si le patient arrête de fumer (risque de surdosage). La substitution nicotinique n'a pas cet effet inducteur.",
      },
      {
        drug1: "bromazépam (benzodiazépine)",
        drug2: "alcool (éthanol)",
        severity: "déconseillée",
        mechanism:
          "L'alcool potentialise les effets dépresseurs des benzodiazépines sur le système nerveux central (sédation, altération de la vigilance, dépression respiratoire) par action synergique sur les récepteurs GABA-A.",
        recommendation:
          "Déconseiller formellement la consommation d'alcool pendant le traitement par benzodiazépines. Informer le patient du risque d'altération majeure de la vigilance et de la conduite automobile.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. Antiacides / Gastroprotecteurs
  // ──────────────────────────────────────────────
  {
    drugClass: "Antiacides et Gastroprotecteurs",
    interactions: [
      {
        drug1: "oméprazole (IPP)",
        drug2: "clopidogrel",
        severity: "déconseillée",
        mechanism:
          "L'oméprazole inhibe le CYP2C19, réduisant la biotransformation du clopidogrel en son métabolite actif et diminuant son effet antiagrégant plaquettaire de 25 à 40 %.",
        recommendation:
          "Remplacer l'oméprazole par le pantoprazole (faible inhibiteur du CYP2C19). Si un IPP est nécessaire, le pantoprazole est l'IPP de choix chez les patients sous clopidogrel.",
      },
      {
        drug1: "oméprazole (IPP)",
        drug2: "méthotrexate",
        severity: "précaution d'emploi",
        mechanism:
          "Les IPP inhibent la pompe à protons rénale (H⁺/K⁺-ATPase) impliquée dans l'élimination tubulaire du méthotrexate, augmentant ses concentrations plasmatiques et le risque de toxicité.",
        recommendation:
          "Arrêter l'IPP quelques jours avant l'administration de méthotrexate à fortes doses. Aux doses rhumatologiques, surveillance de la NFS.",
      },
      {
        drug1: "pantoprazole (IPP)",
        drug2: "lévothyroxine",
        severity: "précaution d'emploi",
        mechanism:
          "Les IPP augmentent le pH gastrique, diminuant la dissolution et l'absorption de la lévothyroxine. Une hypothyroïdie peut réapparaître ou s'aggraver malgré un traitement substitutif correctement dosé.",
        recommendation:
          "Contrôler la TSH 4 à 8 semaines après introduction ou arrêt d'un IPP chez les patients sous lévothyroxine. Adapter la dose si nécessaire. Prendre la lévothyroxine à jeun, 30 minutes avant l'IPP.",
      },
      {
        drug1: "oméprazole (IPP)",
        drug2: "fer (supplémentation orale)",
        severity: "à prendre en compte",
        mechanism:
          "Les IPP diminuent l'acidité gastrique nécessaire à la réduction du fer ferrique (Fe³⁺) en fer ferreux (Fe²⁺), forme absorbable. L'absorption du fer peut être réduite de 50 %.",
        recommendation:
          "Prendre le fer à jeun en dehors de la prise d'IPP. Préférer les sels de fer ferreux. Contrôler l'efficacité du traitement martial par le dosage de la ferritine.",
      },
      {
        drug1: "ranitidine (anti-H2)",
        drug2: "kétoconazole (antifongique azolé)",
        severity: "précaution d'emploi",
        mechanism:
          "La ranitidine augmente le pH gastrique, diminuant la dissolution et l'absorption du kétoconazole qui nécessite un milieu acide pour être correctement absorbé (diminution de la biodisponibilité d'environ 50 %).",
        recommendation:
          "Administrer le kétoconazole avec une boisson acide (cola) ou espacer les prises de 2 heures. Préférer un antifongique dont l'absorption n'est pas pH-dépendante (fluconazole) si possible.",
      },
      {
        drug1: "oméprazole (IPP)",
        drug2: "diazépam (benzodiazépine)",
        severity: "à prendre en compte",
        mechanism:
          "L'oméprazole inhibe le CYP2C19, impliqué dans le métabolisme du diazépam, augmentant modérément ses concentrations plasmatiques et prolongeant sa demi-vie d'élimination.",
        recommendation:
          "Surveiller l'apparition de signes de surdosage en benzodiazépine (somnolence excessive, confusion) chez le sujet âgé. Adapter la posologie du diazépam si nécessaire.",
      },
      {
        drug1: "pantoprazole (IPP)",
        drug2: "calcium (supplémentation)",
        severity: "à prendre en compte",
        mechanism:
          "L'utilisation prolongée des IPP diminue l'absorption intestinale du calcium en augmentant le pH gastrique, contribuant au risque de fractures ostéoporotiques (risque augmenté de 25 % après 1 an d'utilisation).",
        recommendation:
          "Évaluer la nécessité de poursuivre l'IPP au long cours. Assurer un apport suffisant en calcium et en vitamine D. Ostéodensitométrie en cas de traitement prolongé chez les patients à risque.",
      },
      {
        drug1: "oméprazole (IPP)",
        drug2: "magnésium (déplétion)",
        severity: "précaution d'emploi",
        mechanism:
          "Les IPP au long cours (> 3 mois) peuvent provoquer une hypomagnésémie par diminution de l'absorption intestinale active du magnésium, avec risque de tétanie, arythmies et convulsions.",
        recommendation:
          "Doser la magnésémie avant et régulièrement pendant un traitement prolongé par IPP. Supplémenter si nécessaire. Réévaluer régulièrement la nécessité de l'IPP.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. Hypolipémiants
  // ──────────────────────────────────────────────
  {
    drugClass: "Hypolipémiants",
    interactions: [
      {
        drug1: "atorvastatine (statine)",
        drug2: "clarithromycine (macrolide)",
        severity: "contre-indiquée",
        mechanism:
          "La clarithromycine est un puissant inhibiteur du CYP3A4, augmentant de façon majeure les concentrations d'atorvastatine (jusqu'à 5 fois) avec risque élevé de rhabdomyolyse.",
        recommendation:
          "Suspendre la statine pendant la durée du traitement par clarithromycine ou utiliser l'azithromycine (non inhibiteur du CYP3A4). Si la statine doit être maintenue, préférer la rosuvastatine ou la pravastatine.",
      },
      {
        drug1: "simvastatine (statine)",
        drug2: "amlodipine (inhibiteur calcique)",
        severity: "précaution d'emploi",
        mechanism:
          "L'amlodipine inhibe modérément le CYP3A4 et augmente les concentrations plasmatiques de simvastatine d'environ 70 %, augmentant le risque de myopathie et de rhabdomyolyse.",
        recommendation:
          "Ne pas dépasser 20 mg/jour de simvastatine. Envisager le remplacement par la rosuvastatine ou la pravastatine, non métabolisées par le CYP3A4. Surveiller les signes musculaires (myalgies, faiblesse).",
      },
      {
        drug1: "simvastatine (statine)",
        drug2: "jus de pamplemousse",
        severity: "précaution d'emploi",
        mechanism:
          "Le jus de pamplemousse contient des furanocoumarines qui inhibent le CYP3A4 intestinal, augmentant la biodisponibilité de la simvastatine de 3 à 15 fois selon la quantité ingérée, avec risque de rhabdomyolyse.",
        recommendation:
          "Éviter la consommation de pamplemousse et de son jus pendant le traitement par simvastatine (ou atorvastatine). La rosuvastatine et la pravastatine ne sont pas affectées par cette interaction.",
      },
      {
        drug1: "atorvastatine (statine)",
        drug2: "fénofibrate (fibrate)",
        severity: "précaution d'emploi",
        mechanism:
          "L'association statine-fibrate augmente le risque de rhabdomyolyse par addition de la toxicité musculaire. Le risque est moindre avec le fénofibrate qu'avec le gemfibrozil.",
        recommendation:
          "Association possible uniquement avec le fénofibrate (jamais le gemfibrozil qui est contre-indiqué). Doser les CPK avant et régulièrement pendant le traitement. Éduquer le patient aux signes musculaires d'alerte.",
      },
      {
        drug1: "rosuvastatine (statine)",
        drug2: "ciclosporine (immunosuppresseur)",
        severity: "contre-indiquée",
        mechanism:
          "La ciclosporine augmente les concentrations de rosuvastatine de 7 fois en inhibant les transporteurs hépatiques OATP1B1 et BCRP, avec risque majeur de rhabdomyolyse.",
        recommendation:
          "Association contre-indiquée. Si un traitement hypolipémiant est nécessaire chez un patient sous ciclosporine, utiliser la pravastatine à faible dose ou un traitement non statinique (ézétimibe).",
      },
      {
        drug1: "simvastatine (statine)",
        drug2: "rifampicine (antituberculeux)",
        severity: "précaution d'emploi",
        mechanism:
          "La rifampicine induit le CYP3A4, diminuant les concentrations de simvastatine de plus de 80 %, avec perte de l'effet hypolipémiant et risque cardiovasculaire non contrôlé.",
        recommendation:
          "Préférer la pravastatine ou la rosuvastatine, moins affectées par l'induction enzymatique. Contrôler le bilan lipidique et adapter la posologie.",
      },
      {
        drug1: "atorvastatine (statine)",
        drug2: "warfarine (AVK)",
        severity: "à prendre en compte",
        mechanism:
          "L'atorvastatine peut augmenter modérément l'effet anticoagulant des AVK par compétition sur les cytochromes hépatiques et déplacement de la liaison protéique.",
        recommendation:
          "Contrôler l'INR lors de l'introduction ou de la modification de dose de la statine. Adapter la dose d'AVK si nécessaire.",
      },
      {
        drug1: "fénofibrate (fibrate)",
        drug2: "warfarine (AVK)",
        severity: "précaution d'emploi",
        mechanism:
          "Le fénofibrate déplace les AVK de leur liaison à l'albumine et peut inhiber leur métabolisme, potentialisant l'effet anticoagulant avec risque hémorragique accru.",
        recommendation:
          "Réduire la dose d'AVK de 25 à 30 % à l'introduction du fénofibrate. Contrôle rapproché de l'INR pendant les premières semaines. Adaptation posologique progressive.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 9. Antituberculeux
  // ──────────────────────────────────────────────
  {
    drugClass: "Antituberculeux",
    interactions: [
      {
        drug1: "isoniazide",
        drug2: "paracétamol",
        severity: "précaution d'emploi",
        mechanism:
          "L'isoniazide induit le CYP2E1, augmentant la production du métabolite hépatotoxique du paracétamol (NAPQI), tout en diminuant les réserves de glutathion hépatique. Le risque d'hépatotoxicité est multiplié.",
        recommendation:
          "Limiter la posologie du paracétamol à 2 g/jour maximum chez le patient sous isoniazide. Surveillance du bilan hépatique. Éduquer le patient sur les signes d'hépatotoxicité.",
      },
      {
        drug1: "rifampicine",
        drug2: "isoniazide",
        severity: "précaution d'emploi",
        mechanism:
          "L'association obligatoire dans le traitement de la tuberculose augmente le risque d'hépatotoxicité. La rifampicine induit le métabolisme de l'isoniazide en métabolites hépatotoxiques (hydrazine) via le CYP2E1.",
        recommendation:
          "Surveillance régulière du bilan hépatique (ALAT, ASAT) mensuelle pendant les 3 premiers mois puis tous les 2 mois. Arrêt du traitement si transaminases > 5N ou > 3N avec symptômes.",
      },
      {
        drug1: "pyrazinamide",
        drug2: "allopurinol",
        severity: "précaution d'emploi",
        mechanism:
          "Le pyrazinamide inhibe la sécrétion tubulaire d'acide urique et augmente l'uricémie, pouvant provoquer une crise de goutte. L'allopurinol peut ne pas suffire à compenser cette hyperuricémie.",
        recommendation:
          "Doser l'uricémie avant et pendant le traitement par pyrazinamide. Adapter la dose d'allopurinol. Informer le patient des signes de crise de goutte. Le traitement antituberculeux reste prioritaire.",
      },
      {
        drug1: "éthambutol",
        drug2: "isoniazide",
        severity: "à prendre en compte",
        mechanism:
          "Les deux médicaments présentent une neurotoxicité : l'éthambutol provoque une névrite optique rétrobulbaire et l'isoniazide une neuropathie périphérique. L'association peut potentialiser les effets neurotoxiques.",
        recommendation:
          "Examen ophtalmologique avec acuité visuelle et vision des couleurs avant et régulièrement pendant le traitement. Supplémentation en pyridoxine (vitamine B6) 25-50 mg/jour pour prévenir la neuropathie de l'isoniazide.",
      },
      {
        drug1: "rifampicine",
        drug2: "kétoconazole (antifongique azolé)",
        severity: "contre-indiquée",
        mechanism:
          "Interaction bidirectionnelle : la rifampicine induit le CYP3A4, diminuant les concentrations de kétoconazole de 80 %. Le kétoconazole inhibe le CYP3A4, augmentant les concentrations de rifampicine et son hépatotoxicité.",
        recommendation:
          "Association contre-indiquée. Si un antifongique est nécessaire, préférer le fluconazole (moins affecté par l'induction) avec surveillance de l'efficacité antifongique et du bilan hépatique.",
      },
      {
        drug1: "isoniazide",
        drug2: "carbamazépine (antiépileptique)",
        severity: "précaution d'emploi",
        mechanism:
          "L'isoniazide inhibe le CYP3A4, augmentant les concentrations de carbamazépine avec risque de toxicité (ataxie, diplopie, nausées, somnolence). Le risque est majoré chez les acétyleurs lents de l'isoniazide.",
        recommendation:
          "Doser la carbamazépinémie et adapter la posologie. Surveiller les signes de surdosage en carbamazépine. L'effet disparaît quelques jours après l'arrêt de l'isoniazide.",
      },
      {
        drug1: "rifampicine",
        drug2: "rivaroxaban (AOD)",
        severity: "contre-indiquée",
        mechanism:
          "La rifampicine, inducteur puissant du CYP3A4 et de la glycoprotéine P, diminue les concentrations du rivaroxaban de 50 %, entraînant un risque d'échec anticoagulant et de thrombose.",
        recommendation:
          "Éviter les AOD chez les patients sous rifampicine. Utiliser un AVK avec contrôle rapproché de l'INR (adaptation fréquente des doses nécessaire).",
      },
      {
        drug1: "isoniazide",
        drug2: "aliments riches en tyramine et histamine",
        severity: "précaution d'emploi",
        mechanism:
          "L'isoniazide inhibe les monoamine oxydases (MAO) et la diamine oxydase, pouvant provoquer des crises hypertensives avec les aliments riches en tyramine (fromages fermentés) et des réactions histaminiques (thon, maquereau mal conservés).",
        recommendation:
          "Informer les patients d'éviter les fromages fermentés, les charcuteries, le vin rouge, la bière et les poissons mal conservés pendant le traitement par isoniazide.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 10. Autres médicaments
  // ──────────────────────────────────────────────
  {
    drugClass: "Autres médicaments courants",
    interactions: [
      {
        drug1: "méthotrexate",
        drug2: "triméthoprime-sulfaméthoxazole (cotrimoxazole)",
        severity: "contre-indiquée",
        mechanism:
          "Le triméthoprime inhibe la dihydrofolate réductase comme le méthotrexate, potentialisant sa toxicité antifolique. Le sulfaméthoxazole peut également déplacer le méthotrexate de sa liaison protéique et diminuer son excrétion rénale.",
        recommendation:
          "Association contre-indiquée, même à faibles doses de méthotrexate. Risque de pancytopénie sévère. Utiliser un autre antibiotique. En cas d'exposition accidentelle, supplémentation en acide folinique.",
      },
      {
        drug1: "allopurinol",
        drug2: "azathioprine (immunosuppresseur)",
        severity: "contre-indiquée",
        mechanism:
          "L'allopurinol inhibe la xanthine oxydase, enzyme clé du catabolisme de l'azathioprine (via la 6-mercaptopurine), augmentant ses concentrations plasmatiques de 3 à 5 fois avec risque de myélosuppression sévère.",
        recommendation:
          "Si l'association est absolument indispensable, réduire la dose d'azathioprine de 50 à 75 %. Surveillance hématologique très rapprochée (NFS hebdomadaire le premier mois). Préférer le fébuxostat comme alternative (même précaution).",
      },
      {
        drug1: "colchicine",
        drug2: "clarithromycine (macrolide)",
        severity: "contre-indiquée",
        mechanism:
          "La clarithromycine inhibe fortement le CYP3A4 et la glycoprotéine P, augmentant de façon majeure les concentrations de colchicine. Risque de toxicité sévère (pancytopénie, défaillance multiviscérale, décès) chez l'insuffisant rénal.",
        recommendation:
          "Association contre-indiquée, en particulier chez l'insuffisant rénal et hépatique. Si un macrolide est nécessaire, préférer l'azithromycine (moindre inhibition du CYP3A4).",
      },
      {
        drug1: "lévothyroxine",
        drug2: "sels de calcium ou de fer",
        severity: "précaution d'emploi",
        mechanism:
          "Le calcium et le fer forment des complexes insolubles avec la lévothyroxine dans l'estomac, diminuant significativement son absorption (jusqu'à 50 % de réduction de la biodisponibilité).",
        recommendation:
          "Espacer les prises d'au moins 2 heures (idéalement 4 heures). Prendre la lévothyroxine à jeun le matin. Contrôler la TSH 4 à 8 semaines après introduction ou modification de la supplémentation en calcium ou fer.",
      },
      {
        drug1: "digoxine",
        drug2: "amiodarone",
        severity: "précaution d'emploi",
        mechanism:
          "L'amiodarone inhibe la glycoprotéine P rénale et intestinale, augmentant les concentrations de digoxine de 70 à 100 %. L'association augmente aussi le risque de bradycardie sévère et de trouble conductif.",
        recommendation:
          "Réduire la dose de digoxine de moitié dès l'introduction de l'amiodarone. Doser la digoxinémie après 7 jours. Surveiller l'ECG (fréquence cardiaque, PR, QT). Maintenir la surveillance prolongée (demi-vie longue de l'amiodarone).",
      },
      {
        drug1: "théophylline",
        drug2: "ciprofloxacine (fluoroquinolone)",
        severity: "précaution d'emploi",
        mechanism:
          "La ciprofloxacine inhibe le CYP1A2, principal voie métabolique de la théophylline, augmentant ses concentrations de 15 à 30 % avec risque de convulsions, arythmies cardiaques et troubles digestifs.",
        recommendation:
          "Réduire la dose de théophylline de 30 à 50 % dès l'introduction de la ciprofloxacine. Doser la théophyllinémie. Préférer une fluoroquinolone sans interaction sur le CYP1A2 (lévofloxacine, ofloxacine).",
      },
      {
        drug1: "tramadol",
        drug2: "ISRS (sertraline, fluoxétine, paroxétine)",
        severity: "déconseillée",
        mechanism:
          "Le tramadol et les ISRS inhibent tous deux la recapture de la sérotonine. L'association augmente le risque de syndrome sérotoninergique (agitation, myoclonies, hyperthermie, confusion, hyperréflexie). Les ISRS inhibent aussi le CYP2D6, réduisant l'efficacité analgésique du tramadol.",
        recommendation:
          "Éviter l'association. Si indispensable, utiliser la plus faible dose efficace de tramadol et surveiller les signes de syndrome sérotoninergique. Préférer le paracétamol ou un AINS comme alternative analgésique.",
      },
      {
        drug1: "morphine",
        drug2: "benzodiazépines (diazépam, alprazolam)",
        severity: "précaution d'emploi",
        mechanism:
          "Potentialisation de la dépression du système nerveux central : dépression respiratoire, sédation excessive, coma. Le risque est majoré chez le sujet âgé, l'insuffisant respiratoire et en cas de doses élevées.",
        recommendation:
          "Réduire les doses des deux médicaments. Surveillance rapprochée de la fréquence respiratoire, de la saturation en oxygène et du niveau de conscience. Naloxone disponible en cas de dépression respiratoire.",
      },
      {
        drug1: "codéine",
        drug2: "fluoxétine (inhibiteur CYP2D6)",
        severity: "précaution d'emploi",
        mechanism:
          "La codéine est une prodrogue nécessitant le CYP2D6 pour être convertie en morphine (métabolite actif). La fluoxétine inhibe fortement le CYP2D6, diminuant la formation de morphine et l'efficacité analgésique de la codéine.",
        recommendation:
          "Perte d'efficacité analgésique probable. Préférer un analgésique dont l'efficacité ne dépend pas du CYP2D6 (paracétamol, AINS si non contre-indiqué, morphine directe si palier 3 nécessaire).",
      },
      {
        drug1: "amiodarone",
        drug2: "halofantrine (antipaludéen)",
        severity: "contre-indiquée",
        mechanism:
          "Addition de l'allongement de l'intervalle QT par les deux médicaments, avec risque majeur de torsades de pointes et de mort subite.",
        recommendation:
          "Association absolument contre-indiquée. Ne jamais prescrire d'halofantrine chez un patient sous amiodarone. Utiliser un antipaludéen sans effet sur le QT.",
      },
      {
        drug1: "digoxine",
        drug2: "hypokaliémie (diurétiques : furosémide, hydrochlorothiazide)",
        severity: "précaution d'emploi",
        mechanism:
          "L'hypokaliémie induite par les diurétiques augmente la sensibilité du myocarde aux effets toxiques de la digoxine (arythmies ventriculaires), même pour des digoxinémies dans la zone thérapeutique.",
        recommendation:
          "Corriger et prévenir l'hypokaliémie (kaliémie cible > 4 mmol/L). Surveillance régulière de la kaliémie et de la digoxinémie. Envisager l'association d'un diurétique épargneur de potassium si adapté.",
      },
      {
        drug1: "méthotrexate",
        drug2: "AINS (ibuprofène, diclofénac, kétoprofène)",
        severity: "contre-indiquée",
        mechanism:
          "Les AINS diminuent la clairance rénale du méthotrexate par réduction du débit de filtration glomérulaire et inhibition de la sécrétion tubulaire, avec risque de surdosage potentiellement fatal (aplasie médullaire, mucite, insuffisance rénale).",
        recommendation:
          "Contre-indiqué aux doses oncologiques de méthotrexate. Aux doses rhumatologiques (≤ 20 mg/semaine), précaution d'emploi stricte : surveillance NFS et fonction rénale, éviter les AINS en automédication.",
      },
    ],
  },
];

export function getDrugInteractions(): KnowledgeEntry[] {
  return drugClassGroups.map((group) => ({
    source: "drug-interactions",
    title: `Interactions médicamenteuses — ${group.drugClass}`,
    content: formatInteractions(group.interactions),
    metadata: {
      drugClass: group.drugClass,
      language: "fr",
      type: "drug_interaction",
      interactionCount: group.interactions.length,
    },
  }));
}
