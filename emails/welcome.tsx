import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  userName: string
  loginUrl: string
}

export default function WelcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur TeamFlow !</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenue {userName} ! 👋</Heading>
          <Text style={text}>
            Nous sommes ravis de vous accueillir sur TeamFlow, votre nouvelle plateforme
            de gestion de projet collaborative.
          </Text>
          <Text style={text}>
            Vous pouvez maintenant commencer à créer des boards, inviter votre équipe et
            organiser vos projets.
          </Text>
          <Link href={loginUrl} style={button}>
            Accéder au dashboard
          </Link>
          <Text style={footer}>
            Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const h1 = {
  color: '#1d1d1f',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 20px',
}

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const button = {
  backgroundColor: '#007aff',
  borderRadius: '12px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  marginTop: '32px',
}
