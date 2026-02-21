import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

jest.mock('site-config', () => ({
  siteConfig: {
    hidePoweredBy: false,
    infomation: {
      blogname: 'Test Blog',
      email: 'test@example.com',
      github: 'https://github.com/test',
      repository: 'https://github.com/test/repo'
    }
  }
}));

describe('Footer Component', () => {
  it('renders footer with blog name', () => {
    render(<Footer />);
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
  });

  it('renders powered by text when hidePoweredBy is false', () => {
    render(<Footer />);
    expect(screen.getByText(/footer.poweredby/i)).toBeInTheDocument();
  });

  it('renders email link when email is provided', () => {
    render(<Footer />);
    const emailLink = screen.getByLabelText('send mail link');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
  });

  it('renders github link when github is provided', () => {
    render(<Footer />);
    const githubLink = screen.getByLabelText('visit github');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('renders repository link when repository is provided', () => {
    render(<Footer />);
    const repoLink = screen.getByLabelText('visit repository');
    expect(repoLink).toBeInTheDocument();
    expect(repoLink).toHaveAttribute('href', 'https://github.com/test/repo');
    expect(repoLink).toHaveAttribute('target', '_blank');
  });

  it('does not render powered by text when hidePoweredBy is true', () => {
    jest.resetModules();
    jest.mock('site-config', () => ({
      siteConfig: {
        hidePoweredBy: true,
        infomation: {
          blogname: 'Test Blog',
          email: 'test@example.com',
          github: 'https://github.com/test',
          repository: 'https://github.com/test/repo'
        }
      }
    }));
    const FooterComponent = require('../Footer').default;
    render(<FooterComponent />);
    expect(screen.queryByText(/footer.poweredby/i)).not.toBeInTheDocument();
  });

  it('does not render email link when email is not provided', () => {
    jest.resetModules();
    jest.mock('site-config', () => ({
      siteConfig: {
        hidePoweredBy: false,
        infomation: {
          blogname: 'Test Blog',
          email: undefined,
          github: 'https://github.com/test',
          repository: 'https://github.com/test/repo'
        }
      }
    }));
    const FooterComponent = require('../Footer').default;
    render(<FooterComponent />);
    expect(screen.queryByLabelText('send mail link')).not.toBeInTheDocument();
  });
});


