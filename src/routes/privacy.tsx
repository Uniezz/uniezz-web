import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LegalPage, type LegalSection } from '@/components/features/legal';
import { privacyRouteHead } from '@/utils/routeHead';

export const Route = createFileRoute('/privacy')({
  head: () => privacyRouteHead(),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { i18n } = useTranslation();
  const pl = i18n.resolvedLanguage === 'pl';
  const sections: LegalSection[] = pl
    ? [
        {
          title: 'Kto odpowiada za Twoje dane',
          paragraphs: [
            'Administratorem danych jest MADIS sp. z o.o., KRS 0001213822, z siedzibą przy ul. Sądowej 2/11, 20-027 Lublin, Polska. W sprawach prywatności napisz na info@madis.it.com. Spółka nie wyznaczyła inspektora ochrony danych.',
          ],
        },
        {
          title: 'Jakie dane przetwarzamy i skąd je mamy',
          paragraphs: [
            'Przetwarzamy dane, które podajesz lub tworzysz w Uniezz: adres e-mail, imię i nazwisko, uczelnię, kierunek i wydział, rok studiów, datę urodzenia, język, zdjęcie, opis, zainteresowania i ustawienia profilu. Możemy otrzymać dane o tożsamości i studiach od uczelni lub systemu USOS, gdy logujesz się przez te usługi. Nie otrzymujemy Twojego hasła do USOS.',
            'Przetwarzamy również treści, które publikujesz lub przesyłasz: posty, komentarze, polubienia, zapisane posty, materiały do nauki, oceny, propozycje FAQ, zgłoszenia naruszeń oraz informacje o połączeniach i nagrodach w usłudze. Zgłoszenie może zawierać kopię zgłoszonej treści potrzebną do jej sprawdzenia.',
            'Podczas korzystania z serwisu przetwarzamy dane techniczne i diagnostyczne, takie jak adres IP, identyfikatory sesji i żądań, odwiedzone strony, interakcje z interfejsem oraz informacje o błędach. Analityka nie rejestruje sesji; teksty i atrybuty elementów interfejsu są maskowane, a parametry zapytań URL usuwane.',
          ],
        },
        {
          title: 'Cele i podstawy prawne',
          bullets: [
            'Utworzenie konta, weryfikacja statusu studenta, logowanie i działanie funkcji Uniezz — wykonanie umowy (art. 6 ust. 1 lit. b RODO).',
            'Wyświetlanie profilu, obsługa publikacji, komentarzy, materiałów, połączeń i nagród — wykonanie umowy (art. 6 ust. 1 lit. b RODO).',
            'Obsługa zgłoszeń, zapobieganie nadużyciom, ochrona bezpieczeństwa i diagnozowanie awarii — prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).',
            'Wypełnienie obowiązków prawnych oraz ustalenie, dochodzenie lub obrona roszczeń — obowiązek prawny lub prawnie uzasadniony interes, zależnie od sprawy.',
          ],
        },
        {
          title: 'Komu przekazujemy dane',
          paragraphs: [
            'Dane udostępniamy dostawcom, którzy pomagają nam prowadzić Uniezz: dostawcy infrastruktury bazy danych (Supabase), przechowywania plików (Amazon Web Services S3), wysyłki e-maili (Resend), analityki produktu (PostHog) i monitorowania błędów oraz działania API (Sentry). Dostawcy przetwarzają dane w naszym imieniu na podstawie umów. Dane nie są sprzedawane.',
            'Gdy wybierzesz logowanie uczelniane, odpowiedni dostawca tożsamości lub system uczelni uczestniczy w uwierzytelnianiu. Niektóre podmioty mogą przetwarzać dane poza Europejskim Obszarem Gospodarczym. Jeśli dojdzie do takiego transferu, zapewnimy odpowiedni mechanizm wymagany przez RODO, taki jak decyzja stwierdzająca odpowiedni stopień ochrony lub standardowe klauzule umowne.',
          ],
        },
        {
          title: 'Jak długo przechowujemy dane',
          paragraphs: [
            'Dane konta przechowujemy, dopóki konto jest aktywne. Po zleceniu usunięcia rozpoczynamy proces usuwania konta i powiązanych danych. Niektóre komentarze z odpowiedziami mogą pozostać w formie zanonimizowanej. Utworzone przez Ciebie kursy mogą pozostać z anonimową informacją o autorze, natomiast powiązane z kontem pliki są usuwane. Kopie treści zawarte w zgłoszeniach są anonimizowane po usunięciu konta; po 60 dniach usuwamy kopię zgłoszonej treści i odniesienie do zgłoszonej osoby. Dane techniczne i dane dostawców mogą być przechowywane przez czas niezbędny do bezpieczeństwa, diagnostyki lub zgodności z prawem.',
          ],
        },
        {
          title: 'Twoje prawa',
          paragraphs: [
            'Możesz żądać dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, a także wnieść sprzeciw wobec przetwarzania opartego na uzasadnionym interesie i żądać przeniesienia danych, gdy ma to zastosowanie. Możesz również złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych. Napisz na info@madis.it.com, aby skorzystać ze swoich praw.',
          ],
        },
        {
          title: 'Pliki cookie i analityka',
          paragraphs: [
            'Serwis używa plików cookie niezbędnych do utrzymania bezpiecznej sesji logowania. Korzystamy też z PostHog do pomiaru użycia serwisu i jego ulepszania, co może korzystać z plików cookie lub podobnego zapisu w przeglądarce. Możesz ograniczyć pliki cookie w ustawieniach przeglądarki; może to wpłynąć na działanie logowania lub innych funkcji.',
          ],
        },
        {
          title: 'Wiek i zmiany polityki',
          paragraphs: [
            'Uniezz jest przeznaczone dla osób, które ukończyły 16 lat. Funkcje randkowe są dostępne wyłącznie dla osób pełnoletnich. Politykę możemy aktualizować; aktualna wersja jest publikowana pod tym adresem. W sprawach dotyczących danych napisz na info@madis.it.com.',
          ],
        },
      ]
    : [
        {
          title: 'Who is responsible for your data',
          paragraphs: [
            'The controller is MADIS sp. z o.o., KRS 0001213822, registered at Sądowa 2/11, 20-027 Lublin, Poland. Contact us about privacy at info@madis.it.com. The company has not appointed a Data Protection Officer.',
          ],
        },
        {
          title: 'Data we collect and where it comes from',
          paragraphs: [
            'We process information you provide or create in Uniezz: email address, name, university, study programme and faculty, year of study, date of birth, language, photo, bio, interests and profile settings. When you sign in through a university service or USOS, we may receive identity and study information from that provider. We do not receive your USOS password.',
            'We also process content you publish or upload: posts, comments, likes, saved posts, study materials, ratings, FAQ proposals, reports of violations, and information about connections and rewards in the service. A report may include a copy of the reported content so we can review it.',
            'While you use the service, we process technical and diagnostic data such as IP address, session and request identifiers, pages visited, interface interactions and error information. Product analytics does not record sessions; interface text and element attributes are masked, and URL query parameters are removed.',
          ],
        },
        {
          title: 'Purposes and legal bases',
          bullets: [
            'Creating your account, verifying student status, signing you in and providing Uniezz features — performing our contract with you (Article 6(1)(b) GDPR).',
            'Displaying profiles and providing posts, comments, study materials, connections and rewards — performing our contract with you (Article 6(1)(b) GDPR).',
            'Handling reports, preventing abuse, protecting security and diagnosing failures — our legitimate interests (Article 6(1)(f) GDPR).',
            'Meeting legal obligations and establishing, exercising or defending legal claims — a legal obligation or our legitimate interests, depending on the matter.',
          ],
        },
        {
          title: 'Who receives your data',
          paragraphs: [
            'We share data with providers that help us operate Uniezz: database infrastructure (Supabase), file storage (Amazon Web Services S3), email delivery (Resend), product analytics (PostHog), and API error and performance monitoring (Sentry). These providers process data on our behalf under data processing agreements. We do not sell personal data.',
            'If you choose university sign-in, the relevant identity provider or university system participates in authentication. Some providers may process data outside the European Economic Area. If such a transfer occurs, we will ensure it is covered by a GDPR transfer mechanism, such as an adequacy decision or standard contractual clauses.',
          ],
        },
        {
          title: 'How long we keep data',
          paragraphs: [
            'We keep account data while your account is active. When you request account deletion, we start a process to delete the account and associated data. Some comments with replies may remain in anonymised form. Courses you created may remain with anonymous creator attribution, while files associated with your account are deleted. Copies of content in reports are anonymised after the account is deleted; after 60 days we delete the reported content copy and its reference to the reported person. Technical and provider data may be kept as needed for security, diagnostics or legal compliance.',
          ],
        },
        {
          title: 'Your rights',
          paragraphs: [
            'You may request access to, correction or deletion of your data, restriction of processing, and portability where applicable. You may object to processing based on legitimate interests. You can also lodge a complaint with the President of the Polish Personal Data Protection Office (UODO). Contact info@madis.it.com to exercise your rights.',
          ],
        },
        {
          title: 'Cookies and analytics',
          paragraphs: [
            'The service uses cookies needed to maintain a secure sign-in session. We also use PostHog to measure use of the service and improve it, which may use cookies or similar browser storage. You can restrict cookies in your browser settings; this may affect sign-in or other features.',
          ],
        },
        {
          title: 'Age and policy changes',
          paragraphs: [
            'Uniezz is intended for people aged 16 or older. Dating features are available only to adults. We may update this policy; the current version will be available at this address. For privacy requests, contact info@madis.it.com.',
          ],
        },
      ];

  return (
    <LegalPage
      title={pl ? 'Polityka prywatności' : 'Privacy Policy'}
      intro={
        pl
          ? 'Ta polityka wyjaśnia, jak Uniezz zbiera i wykorzystuje Twoje dane osobowe.'
          : 'This policy explains how Uniezz collects and uses your personal data.'
      }
      sections={sections}
    />
  );
}
