import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LegalPage, type LegalSection } from '@/components/features/legal';
import { termsRouteHead } from '@/utils/routeHead';

export const Route = createFileRoute('/terms')({
  head: () => termsRouteHead(),
  component: TermsPage,
});

function TermsPage() {
  const { i18n } = useTranslation();
  const pl = i18n.resolvedLanguage === 'pl';
  const sections: LegalSection[] = pl
    ? [
        {
          title: '1. Operator i akceptacja regulaminu',
          paragraphs: [
            'Uniezz prowadzi MADIS sp. z o.o., KRS 0001213822, Sądowa 2/11, 20-027 Lublin, Polska („Uniezz”, „my”). Korzystając z serwisu, akceptujesz ten regulamin i Politykę prywatności. Jeśli nie akceptujesz tych warunków, nie korzystaj z Uniezz.',
          ],
        },
        {
          title: '2. Kto może korzystać z Uniezz',
          paragraphs: [
            'Możesz korzystać z Uniezz, jeśli masz co najmniej 16 lat i podajesz prawdziwe informacje potrzebne do weryfikacji statusu studenta. Funkcje randkowe są przeznaczone wyłącznie dla osób, które ukończyły 18 lat. Jeśli nie masz pełnej zdolności do czynności prawnych, korzystaj z usługi za zgodą przedstawiciela ustawowego.',
          ],
        },
        {
          title: '3. Konto i bezpieczeństwo',
          paragraphs: [
            'Chroń dane logowania i nie udostępniaj konta innym osobom. Odpowiadasz za działania wykonane z Twojego konta. Możemy odmówić rejestracji lub ograniczyć konto, jeśli informacje są nieprawdziwe, konto zagraża bezpieczeństwu albo narusza ten regulamin lub prawo. Możesz usunąć konto w ustawieniach profilu; usunięcie jest trwałe i może usunąć Twoje monety oraz połączenia.',
          ],
        },
        {
          title: '4. Treści użytkowników',
          paragraphs: [
            'Zachowujesz prawa do treści, które publikujesz. Udzielasz Uniezz niewyłącznej, bezpłatnej licencji na przechowywanie, wyświetlanie, formatowanie i rozpowszechnianie tych treści w zakresie potrzebnym do działania serwisu. Licencja kończy się, gdy usuniesz treść lub konto, z wyjątkiem kopii, które musimy zachować lub zanonimizować zgodnie z prawem i Polityką prywatności.',
            'Publikuj tylko treści, do których masz prawa i których udostępnienie jest zgodne z prawem. Nie publikuj treści bezprawnych, gróźb, nękania, mowy nienawiści, spamu, danych osobowych innych osób bez podstawy ani materiałów naruszających prawa autorskie. Nie podszywaj się pod innych, nie obchodź zabezpieczeń i nie zakłócaj działania usługi.',
            'Przesłane zdjęcia (profilowe, banery i zdjęcia w postach) mogą zostać sprawdzone przez moderatorów i usunięte, jeśli naruszają regulamin lub prawo.',
          ],
        },
        {
          title: '5. Wiadomości',
          paragraphs: [
            'Możesz pisać do swoich połączeń oraz wysłać prośbę o wiadomość do innego studenta, jeśli jego ustawienie „Kto może do mnie pisać” na to pozwala. Do czasu przyjęcia prośby możesz wysłać jedną wiadomość tekstową bez linków i zdjęć; odbiorca może ją przyjąć, odrzucić, zablokować nadawcę lub ją zgłosić. Osoby pełnoletnie nie mogą wysyłać próśb o wiadomość do osób poniżej 18 lat, z którymi nie mają połączenia.',
            'Liczba wiadomości i próśb o wiadomość jest ograniczona. Nie wysyłaj spamu, reklam ani niechcianych lub powtarzających się próśb, nie nękaj innych i nie próbuj obchodzić blokad ani ustawień innych osób. Za naruszenia możemy ograniczyć wysyłanie wiadomości lub zawiesić konto.',
          ],
        },
        {
          title: '6. Bezpieczeństwo dzieci (CSAE)',
          paragraphs: [
            'Aplikacja uniezz ma zerową tolerancję dla Child Sexual Abuse and Exploitation (CSAE), w tym child sexual abuse material (CSAM). Zabronione jest tworzenie, przesyłanie, udostępnianie lub żądanie takich treści oraz wykorzystywanie uniezz do uwodzenia lub wykorzystywania osób małoletnich. Usuwamy te treści, zamykamy konta i zawiadamiamy organy, gdy wymaga tego prawo. Szczegóły i kontakt: strona standardów bezpieczeństwa dzieci oraz info@madis.it.com.',
          ],
        },
        {
          title: '7. Zgłoszenia i moderacja',
          paragraphs: [
            'Możesz zgłaszać profile, karty w funkcji Poznaj, posty, komentarze i wiadomości naruszające te zasady lub prawo, korzystając z funkcji zgłoszenia, a także zablokować innego użytkownika. Możemy sprawdzić zgłoszoną treść i ograniczyć jej widoczność, usunąć ją lub zawiesić konto. Podejmujemy działania proporcjonalnie do rodzaju naruszenia i dostępnych informacji. Decyzje podejmują moderatorzy; treść zgłoszona przez kilka osób może zostać automatycznie ukryta do czasu jej sprawdzenia.',
            'Gdy usuniemy lub ograniczymy Twoją treść albo konto, wyślemy Ci uzasadnienie: co zrobiliśmy, z jakiego powodu i na podstawie której zasady lub przepisu, a także jak możesz się odwołać. Możesz zakwestionować decyzję, pisząc na info@madis.it.com w ciągu 6 miesięcy; rozpatrzymy ją ponownie. Możesz także skorzystać z pozasądowego rozstrzygania sporów lub drogi sądowej.',
          ],
        },
        {
          title: '8. Monety i funkcje serwisu',
          paragraphs: [
            'Monety i nagrody są elementami funkcji Uniezz, nie mają wartości pieniężnej, nie są pieniędzmi elektronicznymi i nie można ich wypłacić ani przenieść poza konto. Możemy zmieniać lub wycofywać funkcje, o ile pozwala na to prawo.',
          ],
        },
        {
          title: '9. Dostępność i odpowiedzialność',
          paragraphs: [
            'Staramy się utrzymywać Uniezz, ale nie gwarantujemy nieprzerwanego lub wolnego od błędów działania. Możemy czasowo ograniczyć dostęp w celu konserwacji, bezpieczeństwa lub naprawy. Regulamin nie ogranicza praw konsumenta ani odpowiedzialności, której nie można wyłączyć na mocy prawa.',
          ],
        },
        {
          title: '10. Zmiany regulaminu i prawo',
          paragraphs: [
            'Możemy aktualizować regulamin, publikując jego nową wersję pod tym adresem. Do korzystania z Uniezz stosuje się prawo polskie, z zachowaniem bezwzględnie obowiązujących praw konsumenta. Pytania i zgłoszenia dotyczące regulaminu kieruj na info@madis.it.com.',
          ],
        },
      ]
    : [
        {
          title: '1. Operator and acceptance',
          paragraphs: [
            'Uniezz is operated by MADIS sp. z o.o., KRS 0001213822, Sądowa 2/11, 20-027 Lublin, Poland (“Uniezz”, “we”). By using the service, you agree to these Terms and the Privacy Policy. If you do not agree, do not use Uniezz.',
          ],
        },
        {
          title: '2. Eligibility',
          paragraphs: [
            'You may use Uniezz if you are at least 16 and provide accurate information needed to verify student status. Dating features are only for people aged 18 or older. If you do not have full legal capacity, use the service with permission from your legal representative.',
          ],
        },
        {
          title: '3. Account and security',
          paragraphs: [
            'Keep your sign-in details secure and do not share your account. You are responsible for activity on your account. We may refuse registration or restrict an account if information is false, the account threatens security, or it violates these Terms or the law. You can request account deletion in your profile settings; deletion is permanent and may remove your coins and connections.',
          ],
        },
        {
          title: '4. User content',
          paragraphs: [
            'You keep the rights to content you post. You grant Uniezz a non-exclusive, royalty-free licence to store, display, format and distribute that content as needed to operate the service. The licence ends when you delete the content or account, except for copies we must retain or anonymise under the law and Privacy Policy.',
            'Post only content you have the right to share and that is lawful. Do not post unlawful content, threats, harassment, hate speech, spam, another person’s personal data without a lawful basis, or material that infringes intellectual property rights. Do not impersonate others, bypass security, or disrupt the service.',
            'Uploaded photos (profile photos, banners and photos in posts) may be reviewed by moderators and removed if they break these Terms or the law.',
          ],
        },
        {
          title: '5. Messages',
          paragraphs: [
            'You can message your connections and send a message request to another student if their “Who can message me” setting allows it. Until the request is accepted, you can send one text message without links or photos; the recipient can accept or decline it, block the sender or report it. Adults cannot send message requests to people under 18 they are not connected with.',
            'Messages and message requests are rate-limited. Do not send spam, advertising, or unwanted or repeated requests, do not harass others, and do not try to get around blocks or other people’s settings. We may restrict messaging or suspend an account for violations.',
          ],
        },
        {
          title: '6. Child safety (CSAE)',
          paragraphs: [
            'The uniezz app has a zero-tolerance policy for Child Sexual Abuse and Exploitation (CSAE), including child sexual abuse material (CSAM). Do not create, upload, share, or request such content, and do not use uniezz to groom or exploit anyone under 18. We remove this content, terminate accounts, and notify authorities where the law requires it. Details and contact: the child safety standards page and info@madis.it.com.',
          ],
        },
        {
          title: '7. Reports and moderation',
          paragraphs: [
            'You can report profiles, Meet cards, posts, comments and messages that violate these rules or the law using the in-service reporting feature, and you can block another user. We may review reported content and limit its visibility, remove it or suspend an account. We take action in proportion to the type of issue and information available. Moderators make these decisions; content reported by several people may be hidden automatically until it is reviewed.',
            'When we remove or restrict your content or account, we send you a statement of reasons: what we did, why, under which rule or law, and how you can contest it. You can contest a decision by emailing info@madis.it.com within 6 months, and we will review it again. You can also use out-of-court dispute settlement or the courts.',
          ],
        },
        {
          title: '8. Coins and service features',
          paragraphs: [
            'Coins and rewards are features of Uniezz. They have no cash value, are not electronic money, and cannot be withdrawn or transferred outside your account. We may change or withdraw features where permitted by law.',
          ],
        },
        {
          title: '9. Availability and liability',
          paragraphs: [
            'We work to keep Uniezz available but do not guarantee uninterrupted or error-free operation. We may temporarily restrict access for maintenance, security or repairs. These Terms do not limit consumer rights or liability that cannot be excluded under applicable law.',
          ],
        },
        {
          title: '10. Changes and governing law',
          paragraphs: [
            'We may update these Terms by publishing a new version at this address. Polish law applies to use of Uniezz, subject to mandatory consumer rights. Send questions and complaints about these Terms to info@madis.it.com.',
          ],
        },
      ];

  return (
    <LegalPage
      title={pl ? 'Regulamin Uniezz' : 'Terms and Conditions'}
      intro={
        pl
          ? 'Regulamin określa zasady korzystania z serwisu Uniezz.'
          : 'These Terms explain the rules for using the Uniezz service.'
      }
      sections={sections}
      updatedAt="2026-11-25"
    />
  );
}
