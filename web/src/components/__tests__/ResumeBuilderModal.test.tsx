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

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'devops' } });

    expect(screen.getByDisplayValue('Staff DevOps & Cloud Infrastructure Engineer')).toBeInTheDocument();
  });

  it('should switch theme when selecting theme dropdown', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    const selects = screen.getAllByRole('combobox');
    const themeSelect = selects[1];
    fireEvent.change(themeSelect, { target: { value: 'executive' } });

    expect(themeSelect).toHaveValue('executive');
  });

  it('should toggle to Markdown editor mode and allow raw editing', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    const markdownBtn = screen.getByTitle('Live Markdown editor');
    fireEvent.click(markdownBtn);

    expect(screen.getByText('Markdown Resume Editor')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/# Full Name/i)).toBeInTheDocument();
  });

  it('should render Export PDF button', () => {
    render(<ResumeBuilderModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
  });
});
