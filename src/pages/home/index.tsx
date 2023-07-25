import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import Image from 'next/image'

import previewImage from '../../assets/app-preview.png'
import { ClaimUsernamForm } from './components/ClaimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title='Descomplique sua agenda | Ignite Call'
        description='Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.'
      />
      <Container>
        <Hero>
          <Heading size="4xl">Agendamento Descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>
          <ClaimUsernamForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            alt="Calendario simbolizando aplicação em funcionamento"
            height={400} // altura máxima que essa imagem pode assumir
            quality={100} // por padrão vem setada como 80% de qualidade das imagens usando Image do Next
            priority // por ser uma imagem principal na home, não deixa o carregamento dela por último
          />
        </Preview>
      </Container>
    </>
  )
}
