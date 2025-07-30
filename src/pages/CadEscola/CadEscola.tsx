import { SignUpForm } from '../../components/Form/SignUpForm';
import '../CadProfessor/CadProfessor.css'; 
import { Header } from '../../components/Header/Header';

export function RegisterSchoolPage() {

  const schoolFields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'exemplo@gmail.com' },
    { name: 'schoolName', label: 'Nome da Escola', type: 'text', placeholder: 'Colégio Exemplo' },
    { name: 'avatarUrl', label: 'Avatar Personalizado (URL)', type: 'url', placeholder: 'https://www.url.com/' },
    { name: 'password', label: 'Senha', type: 'password', placeholder: '********' },
  ] as const;

  const handleRegisterSchool = (formData: Record<string, string>) => {
    console.log('Dados do formulário da escola:', formData);
    alert('Cadastro de escola enviado! Verifique o console para ver os dados.');
  };

  return (
    <div className='page-whith-header'>
      <Header username='Usuario'/> 

      <div className="page-container">
        <SignUpForm
          title="Cadastrar Nova Escola Parceira"
          fields={schoolFields}
          buttonText="Concluir" 
          onSubmit={handleRegisterSchool}
          footerLink={{
            text: 'A escola já possui conta?',
            linkText: 'Voltar', 
            href: '/login' 
          }}
        />
      </div>
    </div>
  );
}