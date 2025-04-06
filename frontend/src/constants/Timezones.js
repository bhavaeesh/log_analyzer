const timezones = [
    {
        id: "Pacific/Niue",
        name: "(UTC-11:00) Coordinated Universal Time-11",
    },
    {
        id: "US/Aleutian",
        name: "(UTC-10:00) Aleutian Islands",
    },
    {
        id: "US/Hawaii",
        name: "(UTC-10:00) Hawaii",
    },
    {
        id: "Pacific/Marquesas",
        name: "(UTC-09:30) Marquesas Islands",
    },
    {
        id: "US/Alaska",
        name: "(UTC-09:00) Alaska",
    },
    {
        id: "Pacific/Gambier",
        name: "(UTC-09:00) Coordinated Universal Time-09",
    },
    {
        id: "America/Tijuana",
        name: "(UTC-08:00) Baja California",
    },
    {
        id: "Pacific/Pitcairn",
        name: "(UTC-08:00) Coordinated Universal Time-08",
    },
    {
        id: "PST8PDT",
        name: "(UTC-08:00) Pacific Time (US & Canada)",
    },
    {
        id: "US/Arizona",
        name: "(UTC-07:00) Arizona",
    },
    {
        id: "America/Chihuahua",
        name: "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
    },
    {
        id: "Canada/Mountain",
        name: "(UTC-07:00) Mountain Time (US & Canada)",
    },
    {
        id: "America/Creston",
        name: "(UTC-06:00) Central America",
    },
    {
        id: "America/Chicago",
        name: "(UTC-06:00) Central Time (US & Canada)",
    },
    {
        id: "Pacific/Easter",
        name: "(UTC-06:00) Easter Island",
    },
    {
        id: "America/Mexico_City",
        name: "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
    },
    {
        id: "Canada/Saskatchewan",
        name: "(UTC-06:00) Saskatchewan",
    },
    {
        id: "America/Bogota",
        name: "(UTC-05:00) Bogota, Lima, Quito, Rio Branco",
    },
    {
        id: "America/Cancun",
        name: "(UTC-05:00) Chetumal",
    },
    {
        id: "America/New_York",
        name: "(UTC-05:00) Eastern Time (US & Canada)",
    },
    {
        id: "America/Port-au-Prince",
        name: "(UTC-05:00) Haiti",
    },
    {
        id: "America/Havana",
        name: "(UTC-05:00) Havana",
    },
    {
        id: "US/East-Indiana",
        name: "(UTC-05:00) Indiana (East)",
    },
    {
        id: "Canada/Atlantic",
        name: "(UTC-04:00) Atlantic Time (Canada)",
    },
    {
        id: "America/Caracas",
        name: "(UTC-04:00) Caracas",
    },
    {
        id: "America/Manaus",
        name: "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
    },
    {
        id: "Canada/Newfoundland",
        name: "(UTC-03:30) Newfoundland",
    },
    {
        id: "America/Araguaina",
        name: "(UTC-03:00) Araguaina",
    },
    {
        id: "America/Santarem",
        name: "(UTC-03:00) Brasilia",
    },
    {
        id: "America/Fortaleza",
        name: "(UTC-03:00) Cayenne, Fortaleza",
    },
    {
        id: "America/Argentina/Buenos_Aires",
        name: "(UTC-03:00) City of Buenos Aires",
    },
    {
        id: "America/Scoresbysund",
        name: "(UTC-03:00) Greenland",
    },
    {
        id: "America/Montevideo",
        name: "(UTC-03:00) Montevideo",
    },
    {
        id: "Antarctica/Palmer",
        name: "(UTC-03:00) Punta Arenas",
    },
    {
        id: "America/Miquelon",
        name: "(UTC-03:00) Saint Pierre and Miquelon",
    },
    {
        id: "America/Noronha",
        name: "(UTC-02:00) Coordinated Universal Time-02",
    },
    {
        id: "Atlantic/Azores",
        name: "(UTC-01:00) Azores",
    },
    {
        id: "UTC",
        name: "(UTC) Coordinated Universal Time",
    },
    {
        id: "Africa/Casablanca",
        name: "(UTC+00:00) Casablanca",
    },
    {
        id: "Europe/London",
        name: "(UTC+00:00) Dublin, Edinburgh, Lisbon, London",
    },
    {
        id: "Atlantic/Reykjavik",
        name: "(UTC+00:00) Monrovia, Reykjavik",
    },
    {
        id: "Europe/Amsterdam",
        name: "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    },
    {
        id: "Europe/Belgrade",
        name: "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    },
    {
        id: "Europe/Paris",
        name: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
    },
    {
        id: "Europe/Sarajevo",
        name: "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
    },
    {
        id: "Africa/Lagos",
        name: "(UTC+01:00) West Central Africa",
    },
    {
        id: "Africa/Windhoek",
        name: "(UTC+01:00) Windhoek",
    },
    {
        id: "Asia/Amman",
        name: "(UTC+02:00) Amman",
    },
    {
        id: "Europe/Bucharest",
        name: "(UTC+02:00) Athens, Bucharest",
    },
    {
        id: "Asia/Beirut",
        name: "(UTC+02:00) Beirut",
    },
    {
        id: "Africa/Cairo",
        name: "(UTC+02:00) Cairo",
    },
    {
        id: "Europe/Chisinau",
        name: "(UTC+02:00) Chisinau",
    },
    {
        id: "Asia/Damascus",
        name: "(UTC+02:00) Damascus",
    },
    {
        id: "Asia/Gaza",
        name: "(UTC+02:00) Gaza, Hebron",
    },
    {
        id: "Africa/Johannesburg",
        name: "(UTC+02:00) Harare, Pretoria",
    },
    {
        id: "Europe/Helsinki",
        name: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    },
    {
        id: "Asia/Jerusalem",
        name: "(UTC+02:00) Jerusalem",
    },
    {
        id: "Europe/Kaliningrad",
        name: "(UTC+02:00) Kaliningrad",
    },
    {
        id: "Africa/Khartoum",
        name: "(UTC+02:00) Khartoum",
    },
    {
        id: "Africa/Tripoli",
        name: "(UTC+02:00) Tripoli",
    },
    {
        id: "Asia/Baghdad",
        name: "(UTC+03:00) Baghdad",
    },
    {
        id: "Asia/Istanbul",
        name: "(UTC+03:00) Istanbul",
    },
    {
        id: "Asia/Riyadh",
        name: "(UTC+03:00) Kuwait, Riyadh",
    },
    {
        id: "Europe/Minsk",
        name: "(UTC+03:00) Minsk",
    },
    {
        id: "Europe/Moscow",
        name: "(UTC+03:00) Moscow, St. Petersburg, Volgograd",
    },
    {
        id: "Africa/Nairobi",
        name: "(UTC+03:00) Nairobi",
    },
    {
        id: "Asia/Tehran",
        name: "(UTC+03:30) Tehran",
    },
    {
        id: "Asia/Dubai",
        name: "(UTC+04:00) Abu Dhabi, Muscat",
    },
    {
        id: "Asia/Baku",
        name: "(UTC+04:00) Baku",
    },
    {
        id: "Europe/Samara",
        name: "(UTC+04:00) Izhevsk, Samara",
    },
    {
        id: "Indian/Mauritius",
        name: "(UTC+04:00) Port Louis",
    },
    {
        id: "Asia/Tbilisi",
        name: "(UTC+04:00) Tbilisi",
    },
    {
        id: "Asia/Yerevan",
        name: "(UTC+04:00) Yerevan",
    },
    {
        id: "UTC_PLUS_0430",
        name: "(UTC+04:30) Kabul",
    },
    {
        id: "Asia/Tashkent",
        name: "(UTC+05:00) Ashgabat, Tashkent",
    },
    {
        id: "Asia/Yekaterinburg",
        name: "(UTC+05:00) Yekaterinburg",
    },
    {
        id: "Asia/Karachi",
        name: "(UTC+05:00) Islamabad, Karachi",
    },
    {
        id: "Asia/Kolkata",
        name: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    },
    {
        id: "Asia/Colombo",
        name: "(UTC+05:30) Sri Jayawardenepura",
    },
    {
        id: "Asia/Kathmandu",
        name: "(UTC+05:45) Kathmandu",
    },
    {
        id: "Asia/Almaty",
        name: "(UTC+06:00) Astana",
    },
    {
        id: "Asia/Dhaka",
        name: "(UTC+06:00) Dhaka",
    },
    {
        id: "Asia/Omsk",
        name: "(UTC+06:00) Omsk",
    },
    {
        id: "Asia/Yangon",
        name: "(UTC+06:30) Yangon (Rangoon)",
    },
    {
        id: "Asia/Bangkok",
        name: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    },
    {
        id: "Asia/Hovd",
        name: "(UTC+07:00) Hovd",
    },
    {
        id: "Asia/Krasnoyarsk",
        name: "(UTC+07:00) Krasnoyarsk",
    },
    {
        id: "Asia/Novosibirsk",
        name: "(UTC+07:00) Novosibirsk",
    },
    {
        id: "Asia/Shanghai",
        name: "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    },
    {
        id: "Asia/Irkutsk",
        name: "(UTC+08:00) Irkutsk",
    },
    {
        id: "Asia/Singapore",
        name: "(UTC+08:00) Kuala Lumpur, Singapore",
    },
    {
        id: "Australia/Perth",
        name: "(UTC+08:00) Perth",
    },
    {
        id: "Asia/Taipei",
        name: "(UTC+08:00) Taipei",
    },
    {
        id: "Asia/Ulaanbaatar",
        name: "(UTC+08:00) Ulaanbaatar",
    },
    {
        id: "Asia/Pyongyang",
        name: "(UTC+08:30) Pyongyang",
    },
    {
        id: "Australia/Eucla",
        name: "(UTC+08:45) Eucla",
    },
    {
        id: "Asia/Tokyo",
        name: "(UTC+09:00) Osaka",
    },
    {
        id: "Asia/Seoul",
        name: "(UTC+09:00) Seoul",
    },
    {
        id: "Asia/Yakutsk",
        name: "(UTC+09:00) Yakutsk",
    },
    {
        id: "Australia/Adelaide",
        name: "(UTC+09:30) Adelaide",
    },
    {
        id: "Australia/Darwin",
        name: "(UTC+09:30) Darwin",
    },
    {
        id: "Australia/Brisbane",
        name: "(UTC+10:00) Brisbane",
    },
    {
        id: "Australia/Sydney",
        name: "(UTC+10:00) Canberra, Melbourne, Sydney",
    },
    {
        id: "Pacific/Port_Moresby",
        name: "(UTC+10:00) Guam, Port Moresby",
    },
    {
        id: "Australia/Hobart",
        name: "(UTC+10:00) Hobart",
    },
    {
        id: "Asia/Vladivostok",
        name: "(UTC+10:00) Vladivostok",
    },
    {
        id: "Australia/Lord_Howe",
        name: "(UTC+10:30) Lord Howe Island",
    },
    {
        id: "Asia/Magadan",
        name: "(UTC+11:00) Magadan",
    },
    {
        id: "Pacific/Norfolk",
        name: "(UTC+11:00) Norfolk Island",
    },
    {
        id: "Asia/Sakhalin",
        name: "(UTC+11:00) Sakhalin",
    },
    {
        id: "Pacific/Guadalcanal",
        name: "(UTC+11:00) Solomon Is., New Caledonia",
    },
    {
        id: "Asia/Anadyr",
        name: "(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky",
    },
    {
        id: "Pacific/Auckland",
        name: "(UTC+12:00) Auckland, Wellington",
    },
    {
        id: "Pacific/Tarawa",
        name: "(UTC+12:00) Coordinated Universal Time+12",
    },
    {
        id: "Pacific/Fiji",
        name: "(UTC+12:00) Fiji",
    },
    {
        id: "Pacific/Chatham",
        name: "(UTC+12:45) Chatham Islands",
    },
    {
        id: "Pacific/Enderbury",
        name: "(UTC+13:00) Coordinated Universal Time+13",
    },
    {
        id: "Pacific/Tongatapu",
        name: "(UTC+13:00) Nuku'alofa",
    },
    {
        id: "Pacific/Apia",
        name: "(UTC+13:00) Samoa",
    },
    {
        id: "Pacific/Kiritimati",
        name: "(UTC+14:00) Kiritimati Island",
    },
];

export default timezones;