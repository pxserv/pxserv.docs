"use client";

import { Select } from "nextra/components";
import { GlobeIcon } from "nextra/icons";
import { usePathname } from "next/navigation";
import { Fragment, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

type Locale = "en" | "tr";

const languageOptions: Array<{ id: Locale; name: string }> = [
  { id: "en", name: "🇬🇧 English" },
  { id: "tr", name: "🇹🇷 Türkçe" },
];

const localizedProjectRoutes: Array<Record<Locale, string>> = [
  { en: "/projects/", tr: "/projeler/" },
  { en: "/projects/beginner/", tr: "/projeler/baslangic/" },
  { en: "/projects/beginner/01-cloud-hello/", tr: "/projeler/baslangic/01-buluta-merhaba/" },
  { en: "/projects/beginner/02-remote-led/", tr: "/projeler/baslangic/02-uzaktan-led/" },
  { en: "/projects/beginner/03-button-counter/", tr: "/projeler/baslangic/03-buton-sayaci/" },
  { en: "/projects/beginner/04-potentiometer/", tr: "/projeler/baslangic/04-potansiyometre/" },
  { en: "/projects/beginner/05-light-level/", tr: "/projeler/baslangic/05-isik-seviyesi/" },
  { en: "/projects/beginner/06-temperature-humidity/", tr: "/projeler/baslangic/06-sicaklik-nem/" },
  { en: "/projects/beginner/07-door-status/", tr: "/projeler/baslangic/07-kapi-durumu/" },
  { en: "/projects/beginner/08-motion-alarm/", tr: "/projeler/baslangic/08-hareket-alarmi/" },
  { en: "/projects/beginner/09-soil-moisture/", tr: "/projeler/baslangic/09-toprak-nemi/" },
  { en: "/projects/beginner/10-remote-buzzer/", tr: "/projeler/baslangic/10-uzaktan-buzzer/" },
  { en: "/projects/intermediate/", tr: "/projeler/orta/" },
  { en: "/projects/intermediate/01-automatic-night-light/", tr: "/projeler/orta/01-otomatik-gece-lambasi/" },
  { en: "/projects/intermediate/02-smart-plant-watering/", tr: "/projeler/orta/02-akilli-bitki-sulama/" },
  { en: "/projects/intermediate/03-parking-sensor/", tr: "/projeler/orta/03-park-sensoru/" },
  { en: "/projects/intermediate/04-room-comfort-station/", tr: "/projeler/orta/04-oda-konfor-istasyonu/" },
  { en: "/projects/intermediate/05-water-tank-level/", tr: "/projeler/orta/05-su-deposu-seviye/" },
  { en: "/projects/intermediate/06-remote-servo-lock/", tr: "/projeler/orta/06-uzaktan-servo-kilit/" },
  { en: "/projects/intermediate/07-cold-chain-alarm/", tr: "/projeler/orta/07-soguk-zincir-alarmi/" },
  { en: "/projects/intermediate/08-rain-alert/", tr: "/projeler/orta/08-yagmur-uyarisi/" },
  { en: "/projects/intermediate/09-visitor-counter/", tr: "/projeler/orta/09-ziyaretci-sayaci/" },
  { en: "/projects/intermediate/10-mini-weather-station/", tr: "/projeler/orta/10-mini-hava-istasyonu/" },
  { en: "/projects/advanced/", tr: "/projeler/ileri/" },
  { en: "/projects/advanced/01-greenhouse-automation/", tr: "/projeler/ileri/01-sera-otomasyonu/" },
  { en: "/projects/advanced/02-machine-vibration-monitoring/", tr: "/projeler/ileri/02-makine-titresim-izleme/" },
  { en: "/projects/advanced/03-smart-tank-pump/", tr: "/projeler/ileri/03-akilli-depo-pompa/" },
  { en: "/projects/advanced/04-gps-tracker/", tr: "/projeler/ileri/04-gps-takip-cihazi/" },
  { en: "/projects/advanced/05-ota-field-device/", tr: "/projeler/ileri/05-ota-saha-cihazi/" },
];

const localizedRoutes: Array<Record<Locale, string>> = [
  { en: "/", tr: "/" },
  { en: "/quick-start/", tr: "/hizli-baslangic/" },
  { en: "/arduino-library/", tr: "/arduino-kutuphanesi/" },
  {
    en: "/javascript-typescript-library/",
    tr: "/javascript-typescript-kutuphanesi/",
  },
  { en: "/rust-library/", tr: "/rust-kutuphanesi/" },
  { en: "/map-feature/", tr: "/harita-ozelligi/" },
  { en: "/ota-feature/", tr: "/ota-ozelligi/" },
  {
    en: "/realtime-connection/",
    tr: "/gercek-zamanli-baglanti/",
  },
  { en: "/rest-api/", tr: "/rest-api/" },
  { en: "/rest-api/database/", tr: "/rest-api/veritabani/" },
  {
    en: "/rest-api/database/all-data-fetching/",
    tr: "/rest-api/veritabani/tum-verileri-okuma/",
  },
  {
    en: "/rest-api/database/data-fetching/",
    tr: "/rest-api/veritabani/veri-okuma/",
  },
  {
    en: "/rest-api/database/data-saving/",
    tr: "/rest-api/veritabani/veri-kaydetme/",
  },
  {
    en: "/rest-api/database/data-toggle/",
    tr: "/rest-api/veritabani/veri-gecisi/",
  },
  {
    en: "/rest-api/database/data-removing/",
    tr: "/rest-api/veritabani/veri-kaldirma/",
  },
  ...localizedProjectRoutes,
];

function isLocale(value: string): value is Locale {
  return languageOptions.some((language) => language.id === value);
}

function normalizeRoute(pathname: string) {
  const route = `/${pathname.split("/").slice(2).filter(Boolean).join("/")}/`;
  return route === "//" ? "/" : route;
}

export function SidebarLanguageSwitch() {
  const pathname = usePathname();
  const [targets, setTargets] = useState<HTMLElement[]>([]);
  const localeSegment = pathname.split("/")[1];
  const locale = isLocale(localeSegment) ? localeSegment : "en";

  useLayoutEffect(() => {
    setTargets(
      Array.from(
        document.querySelectorAll<HTMLElement>(".nextra-sidebar-footer"),
      ),
    );
  }, [pathname]);

  function changeLanguage(nextLocale: string) {
    if (!isLocale(nextLocale) || nextLocale === locale) {
      return;
    }

    const currentRoute = normalizeRoute(pathname);
    const routePair = localizedRoutes.find(
      (routes) => routes[locale] === currentRoute,
    );
    const nextRoute = routePair?.[nextLocale] ?? "/";

    window.location.replace(`/${nextLocale}${nextRoute}`);
  }

  const selectedLanguage = languageOptions.find(
    (language) => language.id === locale,
  )?.name;

  return targets.map((target, index) =>
    createPortal(
      <Select
        className="px-sidebar-language-switch"
        onChange={changeLanguage}
        options={languageOptions}
        selectedOption={
          <Fragment>
            <GlobeIcon height="12" />
            <span>{selectedLanguage}</span>
          </Fragment>
        }
        title={locale === "tr" ? "Dili değiştir" : "Change language"}
        value={locale}
      />,
      target,
      `sidebar-language-switch-${index}`,
    ),
  );
}
