import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LegalPage, type LegalSection } from '@/components/features/legal';
import { childSafetyRouteHead } from '@/utils/routeHead';

export const Route = createFileRoute('/child-safety')({
  head: () => childSafetyRouteHead(),
  component: ChildSafetyPage,
});

function ChildSafetyPage() {
  const { i18n } = useTranslation();
  const pl = i18n.resolvedLanguage === 'pl';
  const sections: LegalSection[] = pl
    ? [
        {
          title: 'Aplikacja i operator',
          paragraphs: [
            'Te standardy dotyczą aplikacji uniezz (Uniezz) w Google Play i App Store oraz serwisu uniezz.pl. Operatorem jest MADIS sp. z o.o., KRS 0001213822, Sądowa 2/11, 20-027 Lublin, Polska.',
          ],
        },
        {
          title: 'Zakaz CSAE',
          paragraphs: [
            'uniezz ma zerową tolerancję dla Child Sexual Abuse and Exploitation (CSAE), w tym child sexual abuse material (CSAM). Zabronione jest tworzenie, przesyłanie, udostępnianie, żądanie, gromadzenie lub w inny sposób rozpowszechnianie takich treści oraz wykorzystywanie uniezz do uwodzenia, seksualizacji lub wykorzystywania osób małoletnich.',
          ],
        },
        {
          title: 'Co jest zabronione',
          bullets: [
            'Materiały przedstawiające seksualne wykorzystywanie dziecka, także fikcyjne, wygenerowane lub zedytowane.',
            'Treści seksualizujące osoby poniżej 18 lat, w tym opisy, obrazy i nagrania.',
            'Grooming, namawianie do aktów seksualnych oraz próby kontaktu seksualnego z osobą małoletnią.',
            'Handel, wymiana lub żądanie CSAM, a także odsyłacze do takich materiałów.',
          ],
        },
        {
          title: 'Ochrona w wiadomościach i funkcji Poznaj',
          bullets: [
            'Osoby pełnoletnie nie mogą wysyłać próśb o wiadomość do osób poniżej 18 lat, z którymi nie mają połączenia.',
            'Funkcje randkowe są dostępne wyłącznie dla osób pełnoletnich; osoby niepełnoletnie nie są w nich pokazywane.',
            'Do czasu przyjęcia prośby o wiadomość nadawca może wysłać tylko jedną wiadomość tekstową, bez linków i zdjęć.',
            'Liczba próśb o wiadomość jest ograniczona, a jedna osoba może mieć naraz tylko kilka oczekujących próśb od nowych kont.',
            'Każdy może ustawić, kto może do niego pisać, zablokować innego użytkownika i zgłosić wiadomość, profil lub kartę.',
            'Moderatorzy przeglądają przesłane zdjęcia profilowe, banery i zdjęcia w postach oraz każdą zgłoszoną wiadomość.',
          ],
        },
        {
          title: 'Zgłoszenia i działania',
          paragraphs: [
            'Zgłoś naruszenie w aplikacji funkcją zgłoszenia (przy wiadomości, profilu, karcie, poście lub komentarzu) albo napisz na adres kontaktu ds. bezpieczeństwa dzieci. Usuwamy takie treści, zawieszamy lub zamykamy konta i zawiadamiamy właściwe organy, gdy wymaga tego prawo.',
          ],
        },
        {
          title: 'Kontakt ds. bezpieczeństwa dzieci',
          paragraphs: [
            'Zespół ds. bezpieczeństwa dzieci uniezz / MADIS sp. z o.o.: info@madis.it.com. Ten adres przyjmuje zgłoszenia CSAE i CSAM dotyczące aplikacji uniezz.',
          ],
        },
      ]
    : [
        {
          title: 'App and publisher',
          paragraphs: [
            'These standards apply to the uniezz app (Uniezz) on Google Play and the App Store, and to uniezz.pl. The publisher is MADIS sp. z o.o., KRS 0001213822, Sądowa 2/11, 20-027 Lublin, Poland.',
          ],
        },
        {
          title: 'CSAE prohibition',
          paragraphs: [
            'uniezz has a zero-tolerance policy for Child Sexual Abuse and Exploitation (CSAE), including child sexual abuse material (CSAM). You must not create, upload, share, request, store, or otherwise circulate such content, or use uniezz to groom, sexualise, or exploit anyone under 18.',
          ],
        },
        {
          title: 'What is banned',
          bullets: [
            'Child sexual abuse material, including fictional, generated, or edited depictions.',
            'Content that sexualises anyone under 18, including text, images, and recordings.',
            'Grooming, solicitation, or attempts to engage a minor in sexual activity.',
            'Trading, requesting, or linking to CSAM.',
          ],
        },
        {
          title: 'Safeguards in messages and Meet',
          bullets: [
            'Adults cannot send message requests to people under 18 they are not connected with.',
            'Dating features are available only to adults; people under 18 are never shown in them.',
            'Until a message request is accepted, the sender can send only one text message, without links or photos.',
            'Message requests are rate-limited, and one person can hold only a few pending requests from new accounts at a time.',
            'Everyone can choose who can message them, block another user, and report a message, profile or card.',
            'Moderators review uploaded profile photos, banners and photos in posts, and every reported message.',
          ],
        },
        {
          title: 'Reports and enforcement',
          paragraphs: [
            'Report a violation with the in-app report tool (on a message, profile, card, post or comment) or email the child safety contact. We remove the content, suspend or terminate accounts, and notify competent authorities where the law requires it.',
          ],
        },
        {
          title: 'Child safety contact',
          paragraphs: [
            'Child safety team for uniezz / MADIS sp. z o.o.: info@madis.it.com. Use this address for CSAE and CSAM reports about the uniezz app.',
          ],
        },
      ];

  return (
    <LegalPage
      title={pl ? 'Standardy bezpieczeństwa dzieci' : 'Child safety standards'}
      intro={
        pl
          ? 'Publiczne standardy uniezz zakazujące Child Sexual Abuse and Exploitation (CSAE).'
          : 'Public standards for uniezz that prohibit Child Sexual Abuse and Exploitation (CSAE).'
      }
      sections={sections}
      updatedAt="2026-11-25"
    />
  );
}
