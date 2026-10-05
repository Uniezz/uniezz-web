import {
  UIAvatar,
  UIBadge,
  UIButton,
  UICard,
  UICheckbox,
  UIImage,
  UIInput,
  UISlider,
  UIText,
} from '@/ui/components';
import { createFileRoute } from '@tanstack/react-router';
import { Coffee, Info, LayoutDashboard, Map, PaperBag } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [text, setText] = useState<string>('');
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [checkBoxValue, setCheckBoxValue] = useState<boolean>(true);

  return (
    <main className="page">
      <UIText>Uniezz</UIText>
      <UIText>A platform for students of Lublin universities.</UIText>
      <UIButton leftIconColor="primary" leftIcon={Map} navigateTo="/login">
        Sign in
      </UIButton>
      <UIButton leftIcon={LayoutDashboard} navigateTo="/feed">
        Open app
      </UIButton>
      <UIText size={'xxl'} color={'secondary'}>
        Hello
      </UIText>
      <UIButton bg={'ghost'} onClick={() => {}}>
        <UIText color={'primary'}>Hi</UIText>
        <UIText color={'primary'}>Hi</UIText>
      </UIButton>
      <UIInput
        placeholder="hi"
        iconLeft={Info}
        iconRight={Info}
        text={text}
        onTextChange={setText}
      />
      <UICheckbox checked={checkBoxValue} onCheckedChange={setCheckBoxValue} />
      <UISlider value={sliderValue} onValueChange={setSliderValue} />
      <UIBadge leftIcon={Coffee} text="Coffee" type={'note'} />
      <UIAvatar
        avatarSymbols="KL"
        size={'sm'}
        imgSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBWg3tDy8nk9WjnykVR7g99XJreBqISw4f1PCkg8gsag&s=10"
      />

      <UIImage
        aspect={'portrait'}
        // isLoading
        imageSrc={
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4W5se-3sXcI-CuvSm5GbPoSk655stnvqEeWyX1M79KA&s=10'
        }
      />
      <UICard
        bottomText={'+248 this month'}
        centerText="12,480"
        headerLeftIcon={PaperBag}
        headerText="Materials in archive"
      />
    </main>
  );
}
