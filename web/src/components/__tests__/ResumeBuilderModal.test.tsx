import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeBuilderModal } from '../ResumeBuilderModal';

describe('ResumeBuilderModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(<ResumeBuilderModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render form editor and live preview in split view by default', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Visual ATS Resume Architect & Form Editor')).toBeInTheDocument();
    expect(screen.getByText('Personal & Contact Details')).toBeInTheDocument();
    expect(screen.getAllByText('Professional Summary').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Technical Skills').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Professional Experience').length).toBeGreaterThanOrEqual(1);
  });

  it('should update state and persist to localStorage on input change', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    const nameInput = screen.getByDisplayValue('Abhinav Prakash');
    fireEvent.change(nameInput, { target: { value: 'Sarah Connor' } });

    expect(screen.getByDisplayValue('Sarah Connor')).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('mapmycareer_resume_draft') || '{}');
    expect(stored.name).toBe('Sarah Connor');
  });

  it('should switch role template when selecting from dropdown', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'devops' } });

    expect(screen.getByDisplayValue('Staff DevOps & Cloud Infrastructure Engineer')).toBeInTheDocument();
  });
});
