// Official District Baselines for JanMitra AI Digital Twin (CSTE)
// Sourced from:
// 1. Jal Jeevan Mission (JJM / IMIS Portal 2024): Functional Household Tap Connection (FHTC) %
// 2. UDISE+ (Ministry of Education 2023-24): Gross Enrollment & Infrastructure Attendance Index
// 3. NFHS-5 (Ministry of Health and Family Welfare): % population within 5km of functioning health facility
// 4. MoHUA Municipal Performance Index (MPI)

export const DISTRICT_BASELINES = {
  varanasi: {
    constituencyName: "Varanasi (UP-77)",
    totalPopulation: 1425000,
    waterCoverage: 76.4,        // JJM official district FHTC rate
    schoolAttendance: 74.2,     // UDISE+ district attendance & retention proxy
    healthcareAccess: 65.8,     // NFHS-5 access within 5km
    avgFacilityDistance: 3.4,   // km to secondary health/education center
    dailyWaterDemandLpcd: 135,  // Liters per capita per day (CPHEEO standard)
    sources: {
      water: "Jal Jeevan Mission (JJM) MIS 2024",
      education: "UDISE+ District Report Card 2023-24",
      health: "NFHS-5 District Fact Sheet (Varanasi)"
    }
  },
  lucknow: {
    constituencyName: "Lucknow (UP-35)",
    totalPopulation: 2815000,
    waterCoverage: 81.2,
    schoolAttendance: 79.5,
    healthcareAccess: 73.1,
    avgFacilityDistance: 2.8,
    dailyWaterDemandLpcd: 150,
    sources: {
      water: "Jal Jeevan Mission MIS 2024",
      education: "UDISE+ District Report Card 2023-24",
      health: "NFHS-5 District Fact Sheet (Lucknow)"
    }
  }
};

export const CSTE_DOMAINS = {
  WATER: "water",
  HEALTH: "health",
  EDUCATION: "education",
  ROAD: "road",
  DRAINAGE: "drainage",
  SANITATION: "sanitation"
};
