/**
 * 모달 관리
 *
 * 주기 폼 모달 및 Duration 입력 필드 관리를 담당한다.
 */

import { elements } from './elements.js';
import {
  parseDurationToValueUnit,
  formatValueUnitToDuration
} from '../duration-utils.js';
import { DURATION_CONSTANTS } from '../constants.js';

// 현재 편집 중인 주기 ID (null이면 생성 모드)
let editingCycleId = null;
let editingCycleData = null;

/**
 * 주기 폼 모달 표시
 * @param {Object|null} cycle - 수정할 주기 (null이면 생성 모드)
 */
export function showCycleModal(cycle = null) {
  editingCycleId = cycle ? cycle.id : null;
  editingCycleData = cycle;

  elements.cycleModalTitle.textContent = cycle ? '복습 주기 수정' : '새 복습 주기';
  elements.cycleTitleInput.value = cycle ? cycle.title : '';
  elements.cycleDurationsContainer.innerHTML = '';

  if (cycle && cycle.durations && cycle.durations.length > 0) {
    cycle.durations.forEach(d => {
      addDurationInput(d);
    });
  } else {
    // 기본 하나 추가
    addDurationInput();
  }

  elements.cycleModal.classList.remove('hidden');
}

/**
 * 주기 폼 모달 숨김
 */
export function hideCycleModal() {
  editingCycleId = null;
  editingCycleData = null;
  elements.cycleModal.classList.add('hidden');
  elements.cycleTitleInput.value = '';
  elements.cycleDurationsContainer.innerHTML = '';
}

/**
 * 현재 편집 중인 주기 ID 반환
 * @returns {number|null}
 */
export function getEditingCycleId() {
  return editingCycleId;
}

/**
 * Duration 입력 필드 추가
 * @param {string} duration - ISO 8601 Duration (기본: 'PT10M')
 */
export function addDurationInput(duration = '') {
  const group = document.createElement('div');
  group.className = 'duration-input-group';

  const { value, unit } = parseDurationToValueUnit(
    duration || DURATION_CONSTANTS.DEFAULT_DURATION
  );

  const valueInput = document.createElement('input');
  valueInput.type = 'number';
  valueInput.min = '1';
  valueInput.className = 'duration-value';
  valueInput.value = value;

  const unitSelect = document.createElement('select');
  unitSelect.className = 'duration-unit';
  unitSelect.innerHTML = `
    <option value="M" ${unit === 'M' ? 'selected' : ''}>분</option>
    <option value="H" ${unit === 'H' ? 'selected' : ''}>시간</option>
    <option value="D" ${unit === 'D' ? 'selected' : ''}>일</option>
  `;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-duration';
  removeBtn.textContent = '×';
  removeBtn.addEventListener('click', () => {
    group.remove();
  });

  group.appendChild(valueInput);
  group.appendChild(unitSelect);
  group.appendChild(removeBtn);

  elements.cycleDurationsContainer.appendChild(group);
}

/**
 * 폼에서 durations 배열 추출
 * @returns {string[]} ISO 8601 Duration 배열
 */
export function getDurationsFromForm() {
  const groups = elements.cycleDurationsContainer.querySelectorAll('.duration-input-group');
  const durations = [];

  groups.forEach(group => {
    const value = parseInt(group.querySelector('.duration-value').value) || 0;
    const unit = group.querySelector('.duration-unit').value;

    if (value > 0) {
      durations.push(formatValueUnitToDuration(value, unit));
    }
  });

  return durations;
}
