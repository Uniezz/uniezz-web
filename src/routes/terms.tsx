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
          ],
        },
        {
          title: '5. Bezpieczeństwo dzieci (CSAE)',
          paragraphs: [
            'Aplikacja uniezz ma zerową tolerancję dla Child Sexual Abuse and Exploitation (CSAE), w tym child sexual abuse material (CSAM). Zabronione jest tworzenie, przesyłanie, udostępnianie lub żądanie takich treści oraz wykorzystywanie uniezz do uwodzenia lub wykorzystywania osób małoletnich. Usuwamy te treści, zamykamy konta i zawiadamiamy organy, gdy wymaga tego prawo. Szczegóły i kontakt: strona standardów bezpieczeństwa dzieci oraz info@madis.it.com.',
          ],
        },
        {
          title: '6. Zgłoszenia i moderacja',
          paragraphs: [
            'Możesz zgłaszać profile, posty i komentarze naruszające te zasady lub prawo, korzystając z funkcji zgłoszenia. Możemy sprawdzić zgłoszoną treść i ograniczyć jej widoczność, usunąć ją lub zawiesić konto. Podejmujemy działania proporcjonalnie do rodzaju naruszenia i dostępnych informacji. W sprawie decyzji moderacyjnej możesz napisać na info@madis.it.com.',
          ],
        },
        {
          title: '7. Monety i funkcje serwisu',
          paragraphs: [
            'Monety i nagrody są elementami funkcji Uniezz, nie mają wartości pieniężnej, nie są pieniędzmi elektronicznymi i nie można ich wypłacić ani przenieść poza konto. Możemy zmieniać lub wycofywać funkcje, o ile pozwala na to prawo.',
          ],
        },
        {
          title: '8. Dostępność i odpowiedzialność',
          paragraphs: [
            'Staramy się utrzymywać Uniezz, ale nie gwarantujemy nieprzerwanego lub wolnego od błędów działania. Możemy czasowo ograniczyć dostęp w celu konserwacji, bezpieczeństwa lub naprawy. Regulamin nie ogranicza praw konsumenta ani odpowiedzialności, której nie można wyłączyć na mocy prawa.',
          ],
        },
        {
          title: '9. Zmiany regulaminu i prawo',
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
          ],
        },
        {
          title: '5. Child safety (CSAE)',
          paragraphs: [
            'The uniezz app has a zero-tolerance policy for Child Sexual Abuse and Exploitation (CSAE), including child sexual abuse material (CSAM). Do not create, upload, share, or request such content, and do not use uniezz to groom or exploit anyone under 18. We remove this content, terminate accounts, and notify authorities where the law requires it. Details and contact: the child safety standards page and info@madis.it.com.',
          ],
        },
        {
          title: '6. Reports and moderation',
          paragraphs: [
            'You can report profiles, posts and comments that violate these rules or the law using the in-service reporting feature. We may review reported content and limit its visibility, remove it or suspend an account. We take action in proportion to the type of issue and information available. To ask us about a moderation decision, contact info@madis.it.com.',
          ],
        },
        {
          title: '7. Coins and service features',
          paragraphs: [
            'Coins and rewards are features of Uniezz. They have no cash value, are not electronic money, and cannot be withdrawn or transferred outside your account. We may change or withdraw features where permitted by law.',
          ],
        },
        {
          title: '8. Availability and liability',
          paragraphs: [
            'We work to keep Uniezz available but do not guarantee uninterrupted or error-free operation. We may temporarily restrict access for maintenance, security or repairs. These Terms do not limit consumer rights or liability that cannot be excluded under applicable law.',
          ],
        },
        {
          title: '9. Changes and governing law',
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
    />
  );
}
