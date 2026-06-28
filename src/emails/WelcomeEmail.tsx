import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName?: string;
  strategyLink: string;
}

export default function WelcomeEmail({ firstName = "friend", strategyLink }: WelcomeEmailProps) {
  const previewText = `Welcome to MakeItAds, ${firstName}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#080810] my-auto mx-auto font-sans">
          <Container className="border border-white/10 border-solid bg-[#0f0f1a] rounded-xl my-[40px] mx-auto p-[20px] max-w-[600px]">
            
            {/* Header / Logo */}
            <Section className="mt-[32px] mb-[32px] text-center">
              <Text className="text-[32px] font-black leading-[1.2] text-white m-0">
                Make<span className="text-[#8b5cf6]">ItAds</span>
              </Text>
            </Section>

            {/* Contenu principal */}
            <Heading className="text-white text-[28px] font-bold text-center p-0 my-[30px] mx-0">
              Welcome aboard, {firstName}! 🚀
            </Heading>
            
            <Text className="text-[#94a3b8] text-[16px] leading-[24px]">
              Thank you for joining MakeItAds. You've just taken the first step toward building high-converting ad strategies without the agency price tag.
            </Text>

            <Text className="text-[#94a3b8] text-[16px] leading-[24px]">
              Your account is fully set up. You can now generate your first complete ad strategy in under 30 seconds.
            </Text>

            {/* Bouton CTA */}
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link
                href={strategyLink}
                className="bg-[#6366f1] rounded-full text-white text-[14px] font-bold no-underline text-center px-[24px] py-[14px] inline-block"
              >
                Generate my first strategy
              </Link>
            </Section>

            <Text className="text-[#94a3b8] text-[14px] leading-[24px]">
              If you have any questions, just reply to this email. We're here to help you scale.
            </Text>

            <Hr className="border-white/10 my-[26px] mx-0 w-full" />

            {/* Footer */}
            <Text className="text-[#64748b] text-[12px] leading-[24px] text-center">
              © 2026 MakeItAds. All rights reserved. <br />
              You received this email because you signed up for MakeItAds.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}