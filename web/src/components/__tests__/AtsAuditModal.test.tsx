import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AtsAuditModal } from '../AtsAuditModal';

describe('AtsAuditModal Component', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(<AtsAuditModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render rubric score and evaluate initial sample resume', () => {
    render(<AtsAuditModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Deterministic ATS Heuristic Auditor')).toBeInTheDocument();
    expect(screen.getByText('Action Verbs')).toBeInTheDocument();
    expect(screen.getByText('Google XYZ')).toBeInTheDocument();
    expect(screen.getByText('Sections')).toBeInTheDocument();
    expect(screen.getByText('Word Count')).toBeInTheDocument();
  });

  it('should update score when user types weak resume content', () => {
    render(<AtsAuditModal isOpen={true} onClose={vi.fn()} />);

    const textarea = screen.getByPlaceholderText('Paste your raw resume text, markdown, or bullet points here...');
    fireEvent.change(textarea, {
      target: { value: 'John Doe\nresponsible for bugs. worked on testing.' },
    });

    expect(screen.getByText(/Eliminate passive phrases/i)).toBeInTheDocument();
  });

  it('should show pre-populated job context badge when passed initialJobContext', () => {
    const jobCtx = {
      title: 'Senior Backend Engineer',
      company: 'Acme Technologies',
      skills: ['Go', 'Kubernetes', 'PostgreSQL'],
    };

    render(<AtsAuditModal isOpen={true} onClose={vi.fn()} initialJobContext={jobCtx} />);

    expect(screen.getByText(/Auditing for:/i)).toBeInTheDocument();
    expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();
  });
});
