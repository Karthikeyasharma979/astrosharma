import React, { forwardRef } from 'react';
import logo from '../../assets/logo_transparent.png';
import { formatDMS } from '../../utils/nakshatraUtils';
import { formatLatLon } from '../../lib/utils';
import { KUNDLI_TRANSLATIONS } from '../../utils/kundliTranslations';
import { KP_TRANSLATIONS, getLocalizedPlanet } from '../../utils/kpTranslations';
import { formatBirthDate, formatBirthTime, getGenderLabel } from '../../utils/kundliSession';
import { REPORT_WIDTH_PX } from '../../utils/kundliReportPdf';
import { DIGNITY_BADGES } from '../kundli/PlanetaryTable';

const LABELS = {
    en: {
        name: 'Name', gender: 'Gender', birthDate: 'Date of Birth', birthTime: 'Time of Birth', birthPlace: 'Birthplace',
        coords: 'Coordinates', timezone: 'Timezone', generatedOn: 'Generated on', vedicTitle: 'Vedic Kundli Report', kpTitle: 'KP Kundli Report',
        vedicSystem: 'Lahiri Ayanamsha • Whole Sign Houses', kpSystem: 'Krishnamurti Paddhati • Placidus Houses',
        summary: 'Kundli Summary', chart: 'Birth Chart', lagna: 'Lagna', moonSign: 'Moon Sign', nakshatra: 'Nakshatra', pada: 'Pada', manglik: 'Manglik Status',
        lagnaLord: 'Lagna Lord', lord: 'Lord', sub: 'Sub Lord', star: 'Star Lord', ayanamsha: 'Ayanamsha', hora: 'Hora Lord',
        planets: 'Planetary Positions', planet: 'Planet', sign: 'Sign', degree: 'Degree', house: 'House', signLord: 'Sign Lord', motion: 'Motion', ssl: 'Sub-Sub Lord',
        retro: 'Retro', direct: 'Direct', insights: 'Vedic Insights', favorable: 'Favorable Elements', manglikReview: 'Kuja (Manglik) Dosha Review',
        marsFromLagna: 'Mars from Lagna', marsFromMoon: 'Mars from Moon', cusps: 'Placidus House Cusps', lordship: 'Planetary Lordship', owns: 'Owns', stlOf: 'Star Lord of', subOf: 'Sub Lord of',
        aspects: 'Aspects to', significators: '4-Level House Significators', level: 'Level', dasha: 'Vimshottari Dasha', birthBalance: 'Balance at birth', currentPeriod: 'Current Period',
        mahadasha: 'Mahadasha', antardasha: 'Antardasha', pratyantardasha: 'Pratyantardasha', start: 'Start', end: 'End', duration: 'Duration', antardashasOf: 'Antardashas of',
        majorAspects: 'Major Planetary Aspects', aspect: 'Aspect', with: 'With', orb: 'Orb', noneNote: 'None', retroNote: 'Planets in red are retrograde.'
    },
    te: {
        name: 'పేరు', gender: 'లింగం', birthDate: 'పుట్టిన తేదీ', birthTime: 'పుట్టిన సమయం', birthPlace: 'పుట్టిన స్థలం',
        coords: 'అక్షాంశ రేఖాంశాలు', timezone: 'సమయ మండలం', generatedOn: 'రూపొందించిన తేదీ', vedicTitle: 'వేద కుండలి నివేదిక', kpTitle: 'KP కుండలి నివేదిక',
        vedicSystem: 'లాహిరి అయనాంశ • సంపూర్ణ రాశి భావాలు', kpSystem: 'కృష్ణమూర్తి పద్ధతి • ప్లాసిడస్ భావాలు',
        summary: 'కుండలి సారాంశం', chart: 'జన్మ చక్రం', lagna: 'లగ్నం', moonSign: 'చంద్ర రాశి', nakshatra: 'నక్షత్రం', pada: 'పాదం', manglik: 'కుజ దోష స్థితి',
        lagnaLord: 'లగ్నాధిపతి', lord: 'అధిపతి', sub: 'సబ్ లార్డ్', star: 'నక్షత్రాధిపతి', ayanamsha: 'అయనాంశ', hora: 'హోరాధిపతి',
        planets: 'గ్రహ స్థితులు', planet: 'గ్రహం', sign: 'రాశి', degree: 'డిగ్రీ', house: 'భావం', signLord: 'రాశ్యాధిపతి', motion: 'గతి', ssl: 'సబ్-సబ్ లార్డ్',
        retro: 'వక్రి', direct: 'సవ్య', insights: 'వేద విశ్లేషణ', favorable: 'అనుకూల అంశాలు', manglikReview: 'కుజ దోష సమీక్ష',
        marsFromLagna: 'లగ్నం నుండి కుజుడు', marsFromMoon: 'చంద్రుని నుండి కుజుడు', cusps: 'ప్లాసిడస్ భావ సంధులు', lordship: 'గ్రహ భావ ఆధిపత్యం', owns: 'స్వంతం', stlOf: 'నక్షత్రాధిపతి', subOf: 'సబ్ లార్డ్',
        aspects: 'దృష్టి', significators: '4-స్థాయి భావ కారకత్వాలు', level: 'స్థాయి', dasha: 'వింశోత్తరి దశ', birthBalance: 'జనన సమయ దశా శేషం', currentPeriod: 'ప్రస్తుత దశ',
        mahadasha: 'మహాదశ', antardasha: 'అంతర్దశ', pratyantardasha: 'ప్రత్యంతర్దశ', start: 'ప్రారంభం', end: 'ముగింపు', duration: 'కాలం', antardashasOf: 'అంతర్దశలు:',
        majorAspects: 'ప్రధాన గ్రహ దృష్టులు', aspect: 'దృష్టి', with: 'గ్రహం', orb: 'ఆర్బ్', noneNote: 'లేవు', retroNote: 'ఎరుపు రంగులోని గ్రహాలు వక్రగతిలో ఉన్నాయి.'
    }
};

// South Indian layout: each sign keeps a fixed cell, clockwise from Pisces at the top-left
const SOUTH_CELLS = [
    { signIndex: 11, en: 'Pisces', te: 'మీనం', row: 1, col: 1 },
    { signIndex: 0, en: 'Aries', te: 'మేషం', row: 1, col: 2 },
    { signIndex: 1, en: 'Taurus', te: 'వృషభం', row: 1, col: 3 },
    { signIndex: 2, en: 'Gemini', te: 'మిథునం', row: 1, col: 4 },
    { signIndex: 10, en: 'Aquarius', te: 'కుంభం', row: 2, col: 1 },
    { signIndex: 3, en: 'Cancer', te: 'కర్కాటకం', row: 2, col: 4 },
    { signIndex: 9, en: 'Capricorn', te: 'మకరం', row: 3, col: 1 },
    { signIndex: 4, en: 'Leo', te: 'సింహం', row: 3, col: 4 },
    { signIndex: 8, en: 'Sagittarius', te: 'ధనస్సు', row: 4, col: 1 },
    { signIndex: 7, en: 'Scorpio', te: 'వృశ్చికం', row: 4, col: 2 },
    { signIndex: 6, en: 'Libra', te: 'తుల', row: 4, col: 3 },
    { signIndex: 5, en: 'Virgo', te: 'కన్య', row: 4, col: 4 }
];

const Block = ({ title, children }) => (
    <section data-report-block className="bg-white text-black pb-3">
        {title && (
            <div className="mb-2 pb-1.5 border-b-2 border-orange-500 text-[15px] font-bold leading-relaxed">
                {title}
            </div>
        )}
        {children}
    </section>
);

const Table = ({ columns, rows }) => (
    <table className="w-full border-collapse text-[11px] leading-relaxed">
        <thead>
            <tr>
                {columns.map((column, index) => (
                    <th key={index} className="px-2 pt-1 pb-2.5 text-left font-bold bg-orange-50 border border-stone-300 text-black">{column}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {rows.map(row => (
                <tr key={row.key} className={row.retro ? 'text-[#dc2626] font-bold' : 'text-black'}>
                    {row.cells.map((cell, index) => (
                        <td key={index} className={`px-2 pt-0.5 pb-2 border border-stone-300 ${index === 0 ? 'font-bold' : ''}`}>{cell}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const Fact = ({ label, value }) => (
    <div className="px-3 py-2 rounded-lg border border-stone-300 min-w-0">
        <div className="text-[10px] font-bold text-stone-600 leading-relaxed">{label}</div>
        <div className="text-[12px] font-bold text-black leading-relaxed break-words">{value}</div>
    </div>
);

const SummaryCard = ({ label, value, detail }) => (
    <div className="px-3 py-2.5 rounded-lg border border-orange-300 bg-orange-50/60 min-w-0">
        <div className="text-[10px] font-bold text-stone-600 leading-relaxed">{label}</div>
        <div className="text-[15px] font-bold text-black leading-relaxed">{value}</div>
        {detail && <div className="text-[11px] text-black leading-relaxed">{detail}</div>}
    </div>
);

const SouthChart = ({ entriesFor, center, isTe }) => (
    <div className="grid grid-cols-4 border border-stone-500" style={{ gridAutoRows: '132px' }}>
        {SOUTH_CELLS.map(cell => (
            <div
                key={cell.signIndex}
                style={{ gridRow: cell.row, gridColumn: cell.col }}
                className="border border-stone-400 p-1.5 overflow-hidden"
            >
                <div className="text-[9px] font-bold text-stone-500 leading-relaxed">{isTe ? cell.te : cell.en}</div>
                {entriesFor(cell.signIndex).map(entry => (
                    <div
                        key={entry.key}
                        className={`text-[11px] font-bold leading-snug whitespace-nowrap ${entry.retro ? 'text-[#dc2626]' : 'text-black'}`}
                    >
                        {entry.label}
                    </div>
                ))}
            </div>
        ))}
        <div
            style={{ gridRow: '2 / span 2', gridColumn: '2 / span 2' }}
            className="border border-stone-400 flex flex-col items-center justify-center text-center gap-0.5 text-[11px] font-bold text-black leading-relaxed"
        >
            {center}
        </div>
    </div>
);

const ReportHeader = ({ title, system, params, l, isTe }) => {
    const genderLabel = getGenderLabel(params.gender, isTe);
    const facts = [
        { label: l.name, value: params.name },
        genderLabel && { label: l.gender, value: genderLabel },
        { label: l.birthDate, value: formatBirthDate(params.birthDate, isTe) },
        { label: l.birthTime, value: formatBirthTime(params.birthTime) },
        { label: l.birthPlace, value: params.birthPlace },
        { label: `${l.coords} / ${l.timezone}`, value: `${formatLatLon(params.lat, params.lon)} • ${params.timezone}` }
    ].filter(Boolean);

    return (
        <Block>
            <div className="flex items-center justify-between gap-4 pb-3 mb-3 border-b-4 border-orange-500">
                <div className="flex items-center gap-3 min-w-0">
                    <img src={logo} alt="" className="w-14 h-14 rounded-full" />
                    <div>
                        <div className="text-[13px] font-bold text-orange-700 leading-relaxed">AstroSharma</div>
                        <div className="text-[22px] font-bold text-black leading-snug">{title}</div>
                        <div className="text-[11px] text-stone-700 leading-relaxed">{system}</div>
                    </div>
                </div>
                <div className="text-right shrink-0 text-[10px] text-stone-700 leading-relaxed">
                    <div>{l.generatedOn}</div>
                    <div className="font-bold text-black">{new Date().toLocaleDateString('en-GB')}</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {facts.map(fact => <Fact key={fact.label} {...fact} />)}
            </div>
        </Block>
    );
};

const VedicReport = ({ result, params, lang }) => {
    const isTe = lang === 'te';
    const l = LABELS[lang] || LABELS.te;
    const t = KUNDLI_TRANSLATIONS[lang] || KUNDLI_TRANSLATIONS.te;
    const { lagna, lagnaLord, moonSign, nakshatra, pada, planets, doshas, traditionalFactors } = result;
    const manglik = doshas.manglik;

    const manglikLabel = isTe
        ? (manglik.hasDosha ? (manglik.severity === 'Mitigated' ? 'పరిహారమైనది' : 'స్వల్ప దోషం') : 'దోషం లేదు')
        : (manglik.severity === 'None' ? 'Non-Manglik' : `${manglik.severity} Manglik`);

    const entriesFor = (signIndex) => [
        ...(lagna.signIndex === signIndex ? [{ key: 'lagna', label: `${l.lagna} ${formatDMS(lagna.degreeInSign)}` }] : []),
        ...planets.filter(p => p.signIndex === signIndex).map(p => ({
            key: p.key,
            label: `${isTe ? p.te : p.short} ${formatDMS(p.degreeInSign)}`,
            retro: p.isRetrograde
        }))
    ];

    const favorable = [
        { label: t.gemstone, value: traditionalFactors.gemstone },
        { label: t.nakshatraStone, value: traditionalFactors.nakshatraStone },
        { label: t.color, value: traditionalFactors.color },
        { label: t.number, value: traditionalFactors.number },
        { label: t.day, value: traditionalFactors.day },
        { label: t.deity, value: traditionalFactors.deity }
    ];

    return (
        <>
            <ReportHeader title={l.vedicTitle} system={l.vedicSystem} params={params} l={l} isTe={isTe} />

            <Block title={l.summary}>
                <div className="grid grid-cols-4 gap-2">
                    <SummaryCard label={l.lagna} value={isTe ? lagna.sign.te : lagna.sign.en} detail={`${l.lagnaLord}: ${isTe ? getLocalizedPlanet(lagnaLord, 'te') : lagnaLord}`} />
                    <SummaryCard label={l.moonSign} value={isTe ? moonSign.te : moonSign.en} detail={`${l.lord}: ${isTe ? getLocalizedPlanet(moonSign.lord, 'te') : moonSign.lord}`} />
                    <SummaryCard label={l.nakshatra} value={isTe ? nakshatra.te : nakshatra.name} detail={`${l.pada} ${pada}`} />
                    <SummaryCard label={l.manglik} value={manglikLabel} detail={isTe ? `కుజుడు: ${manglik.marsHouseFromLagna}వ భావం` : `Mars: House ${manglik.marsHouseFromLagna}`} />
                </div>
            </Block>

            <Block title={l.chart}>
                <SouthChart
                    entriesFor={entriesFor}
                    isTe={isTe}
                    center={
                        <>
                            <div className="text-[14px]">{isTe ? 'రాశి చక్రం' : 'RASI CHART'}</div>
                            <div>{l.lagna}: {isTe ? lagna.sign.te : lagna.sign.en}</div>
                            <div>{l.retroNote}</div>
                        </>
                    }
                />
            </Block>

            <Block title={l.planets}>
                <Table
                    columns={[l.planet, l.sign, l.degree, l.house, l.motion, t.dignity, l.nakshatra]}
                    rows={planets.map(p => {
                        const dignity = DIGNITY_BADGES[p.dignity];
                        return {
                            key: p.key,
                            retro: p.isRetrograde,
                            cells: [
                                isTe ? p.te : p.name,
                                isTe ? p.sign.te : p.sign.en,
                                formatDMS(p.degreeInSign),
                                p.house,
                                p.isRetrograde ? l.retro : l.direct,
                                isTe && dignity?.te ? dignity.te : p.dignity,
                                p.nakshatra ? `${isTe ? p.nakshatra.te : p.nakshatra.name} (${l.pada} ${p.pada})` : '-'
                            ]
                        };
                    })}
                />
            </Block>

            <Block title={l.insights}>
                <div className="space-y-2 text-[12px] text-black leading-relaxed">
                    <p>
                        <strong>{isTe ? `${lagna.sign.te} లగ్నం • లగ్నాధిపతి: ${getLocalizedPlanet(lagnaLord, 'te')}` : `Ascendant (${lagna.sign.en} Lagna) • Ruled by ${lagnaLord}`}</strong><br />
                        {isTe
                            ? `ప్రాచీన పరాశర జ్యోతిష సంప్రదాయం ప్రకారం, ${lagna.sign.te} లగ్నంలో జన్మించిన వారికి ${lagna.sign.element} తత్త్వ ప్రభావం, లగ్నాధిపతి ${lagnaLord} అనుగ్రహం వలన సహజ నాయకత్వ లక్షణాలు, దృఢ సంకల్పం మరియు ఉన్నత ఆశయాలు ఉంటాయి.`
                            : traditionalFactors.summary}
                    </p>
                    <p>
                        <strong>{isTe ? `చంద్ర రాశి & నక్షత్ర ప్రభావం (${moonSign.te} • ${nakshatra.te} ${pada}వ పాదం)` : `Mind & Emotion (${moonSign.en} • ${nakshatra.name} Pada ${pada})`}</strong><br />
                        {isTe
                            ? `${nakshatra.te} నక్షత్రంలో (${nakshatra.deity} అధిదేవత, ${nakshatra.lord} అధిపతి) జన్మించినందున, తీక్షణమైన మేధస్సు, కుటుంబ బంధాల పట్ల అపారమైన గౌరవం మరియు సంక్షోభ సమయాల్లో సంయమనం ప్రదర్శిస్తారు.`
                            : `Under ${nakshatra.name} Nakshatra (presided by ${nakshatra.deity} and governed by ${nakshatra.lord}), the native demonstrates mental resilience, intuitive focus, and loyalty to loved ones.`}
                    </p>
                </div>
            </Block>

            <Block title={l.favorable}>
                <div className="grid grid-cols-3 gap-2">
                    {favorable.map(item => <Fact key={item.label} {...item} />)}
                </div>
            </Block>

            <Block title={l.manglikReview}>
                <div className="space-y-2 text-[12px] text-black leading-relaxed">
                    <p><strong>{manglikLabel}.</strong> {manglik.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Fact label={l.marsFromLagna} value={isTe ? `${manglik.marsHouseFromLagna}వ భావం` : `House ${manglik.marsHouseFromLagna}`} />
                        <Fact label={l.marsFromMoon} value={isTe ? `${manglik.marsHouseFromMoon}వ భావం` : `House ${manglik.marsHouseFromMoon}`} />
                    </div>
                    <p className="text-[10px] text-stone-700">{t.disclaimerNotice}</p>
                </div>
            </Block>
        </>
    );
};

const KPReport = ({ result, params, lang }) => {
    const isTe = lang === 'te';
    const l = LABELS[lang] || LABELS.te;
    const tKP = KP_TRANSLATIONS[lang] || KP_TRANSLATIONS.te;
    const { lagna, moonSign, nakshatra, subLord, planets, cusps, significators, hora, dasha, aspects, metadata } = result;

    const planetName = (name) => (isTe ? getLocalizedPlanet(name, 'te') : name);
    const planetList = (names) => (names?.length ? names.map(name => planetName(name)).join(', ') : '-');

    const formatDate = (iso) => new Intl.DateTimeFormat('en-GB', {
        timeZone: params.timezone || 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(iso));

    const dashaRows = (periods) => periods.map(period => ({
        key: period.id,
        cells: [isTe ? period.te : period.name, formatDate(period.startDate), formatDate(period.endDate), period.durationFormatted?.formatted || '-']
    }));

    const cuspCode = (houseNumber) => (houseNumber === 1 ? (isTe ? 'లగ్నం' : 'AS') : (isTe ? `${houseNumber}వ` : `H${houseNumber}`));

    const entriesFor = (signIndex) => [
        ...cusps.filter(c => c.signIndex === signIndex).map(c => ({
            key: `cusp-${c.houseNumber}`,
            label: `${cuspCode(c.houseNumber)} ${formatDMS(c.degreeInSign)}`
        })),
        ...planets.filter(p => p.signIndex === signIndex).map(p => ({
            key: p.key,
            label: `${isTe ? p.te : p.short} ${formatDMS(p.degreeInSign)}`,
            retro: p.isRetrograde
        }))
    ];

    const lordship = significators?.planetaryLordshipMatrix;
    const active = dasha?.activePeriods;
    const activeLevels = active ? [
        { label: l.mahadasha, period: active.mahadasha },
        { label: l.antardasha, period: active.antardasha },
        { label: l.pratyantardasha, period: active.pratyantardasha }
    ].filter(level => level.period) : [];
    const majorAspects = (aspects?.aspects || []).filter(a => a.isMajor && a.targetType === 'planet');

    return (
        <>
            <ReportHeader title={l.kpTitle} system={l.kpSystem} params={params} l={l} isTe={isTe} />

            <Block title={l.summary}>
                <div className="grid grid-cols-4 gap-2">
                    <SummaryCard label={l.lagna} value={isTe ? lagna.sign.te : lagna.sign.en} detail={`${l.sub}: ${planetName(lagna.subLord)}`} />
                    <SummaryCard label={l.moonSign} value={isTe ? moonSign.te : moonSign.en} detail={`${l.sub}: ${planetName(subLord)}`} />
                    <SummaryCard label={l.nakshatra} value={isTe ? nakshatra.te : nakshatra.name} detail={`${l.star}: ${planetName(nakshatra.starLord)}`} />
                    <SummaryCard
                        label={l.ayanamsha}
                        value={metadata?.ayanamshaFormatted}
                        detail={hora ? `${l.hora}: ${isTe ? hora.horaPlanetTe : hora.horaPlanet}` : metadata?.ayanamshaMode}
                    />
                </div>
            </Block>

            <Block title={l.chart}>
                <SouthChart
                    entriesFor={entriesFor}
                    isTe={isTe}
                    center={
                        <>
                            <div className="text-[14px]">{isTe ? 'KP భావ చక్రం' : 'CUSP CHART'}</div>
                            <div>{l.ayanamsha}: {metadata?.ayanamshaFormatted}</div>
                            <div>{metadata?.ayanamshaMode} • {metadata?.nodeMode}</div>
                            <div>{l.retroNote}</div>
                        </>
                    }
                />
            </Block>

            <Block title={l.planets}>
                <Table
                    columns={[l.planet, l.sign, l.degree, l.house, l.signLord, l.star, l.sub, l.ssl]}
                    rows={planets.map(p => ({
                        key: p.key,
                        retro: p.isRetrograde,
                        cells: [
                            isTe ? p.te : p.name,
                            isTe ? p.sign.te : p.sign.en,
                            formatDMS(p.degreeInSign),
                            p.house,
                            planetName(p.signLord),
                            planetName(p.starLord),
                            planetName(p.subLord),
                            planetName(p.subSubLord)
                        ]
                    }))}
                />
            </Block>

            <Block title={l.cusps}>
                <Table
                    columns={[l.house, l.sign, l.degree, l.signLord, l.star, l.sub, l.ssl]}
                    rows={cusps.map(c => ({
                        key: c.houseNumber,
                        cells: [
                            cuspCode(c.houseNumber),
                            isTe ? c.sign.te : c.sign.en,
                            formatDMS(c.degreeInSign),
                            planetName(c.signLord),
                            planetName(c.starLord),
                            planetName(c.subLord),
                            planetName(c.subSubLord)
                        ]
                    }))}
                />
            </Block>

            {lordship?.length > 0 && (
                <Block title={l.lordship}>
                    <Table
                        columns={[l.planet, l.house, l.owns, l.stlOf, l.subOf, l.aspects]}
                        rows={lordship.map(row => ({
                            key: row.key,
                            retro: row.isRetro,
                            cells: [planetName(row.key), row.house, row.ownsStr, row.stlOfStr, row.subOfStr, row.aspectsStr || '-']
                        }))}
                    />
                </Block>
            )}

            {significators?.houseSignificators?.length > 0 && (
                <Block title={l.significators}>
                    <Table
                        columns={[l.house, `${l.level} 1`, `${l.level} 2`, `${l.level} 3`, `${l.level} 4`]}
                        rows={significators.houseSignificators.map(house => ({
                            key: house.houseNumber,
                            cells: [
                                cuspCode(house.houseNumber),
                                planetList(house.level1),
                                planetList(house.level2),
                                planetList(house.level3),
                                planetList(house.level4)
                            ]
                        }))}
                    />
                </Block>
            )}

            {dasha?.mahadashas?.length > 0 && (
                <>
                    <Block title={l.dasha}>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            <Fact label={l.birthBalance} value={dasha.balanceInfo?.balanceFormatted?.formatted || '-'} />
                            {activeLevels.map(level => (
                                <Fact
                                    key={level.label}
                                    label={`${l.currentPeriod} - ${level.label}`}
                                    value={`${isTe ? level.period.te : level.period.name} (${formatDate(level.period.endDate)})`}
                                />
                            ))}
                        </div>
                        <Table columns={[l.mahadasha, l.start, l.end, l.duration]} rows={dashaRows(dasha.mahadashas)} />
                    </Block>

                    {active?.mahadasha?.antardashas?.length > 0 && (
                        <Block title={`${l.antardashasOf} ${isTe ? active.mahadasha.te : active.mahadasha.name} ${l.mahadasha}`}>
                            <Table columns={[l.antardasha, l.start, l.end, l.duration]} rows={dashaRows(active.mahadasha.antardashas)} />
                        </Block>
                    )}
                </>
            )}

            {majorAspects.length > 0 && (
                <Block title={l.majorAspects}>
                    <Table
                        columns={[l.planet, l.aspect, l.with, l.orb]}
                        rows={majorAspects.map(a => ({
                            key: a.id,
                            cells: [
                                isTe ? a.castingBody.te : a.castingBody.name,
                                isTe ? a.aspectNameTe : `${a.aspectType} (${a.nominalAngle}°)`,
                                isTe ? a.receivingBody.te : a.receivingBody.name,
                                a.orbFormatted
                            ]
                        }))}
                    />
                </Block>
            )}

            <Block>
                <p className="text-[10px] text-stone-700 leading-relaxed text-center">{tKP.printNotice}</p>
            </Block>
        </>
    );
};

// Laid out off-screen at a fixed A4 width, so the PDF is the same on a phone and a desktop
export const KundliReportDocument = forwardRef(({ system, result, params, lang }, ref) => (
    <div
        ref={ref}
        aria-hidden="true"
        className="bg-white text-black"
        style={{
            position: 'fixed',
            top: 0,
            left: '-10000px',
            width: `${REPORT_WIDTH_PX}px`,
            fontFamily: '"Noto Sans Telugu", Inter, sans-serif'
        }}
    >
        {system === 'kp'
            ? <KPReport result={result} params={params} lang={lang} />
            : <VedicReport result={result} params={params} lang={lang} />}
    </div>
));
