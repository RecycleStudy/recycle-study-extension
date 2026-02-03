/**
 * 주기 관련 UI
 *
 * 주기 선택 드롭다운 및 주기 목록 렌더링을 담당한다.
 */

import { elements } from './elements.js';
import { formatDurationsForDisplay } from '../duration-utils.js';

/**
 * 주기 선택 드롭다운 렌더링
 * @param {Array} defaultOptions - 기본 주기 옵션
 * @param {Array} customOptions - 커스텀 주기 옵션
 */
export function renderCycleSelect(defaultOptions, customOptions) {
  elements.cycleSelect.innerHTML = '';

  // 기본 주기 옵션
  if (defaultOptions && defaultOptions.length > 0) {
    const defaultGroup = document.createElement('optgroup');
    defaultGroup.label = '기본 주기';
    defaultOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = `DEFAULT:${option.code}`;
      opt.textContent = option.title;
      defaultGroup.appendChild(opt);
    });
    elements.cycleSelect.appendChild(defaultGroup);
  }

  // 커스텀 주기 옵션
  if (customOptions && customOptions.length > 0) {
    const customGroup = document.createElement('optgroup');
    customGroup.label = '나의 주기';
    customOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = `CUSTOM:${option.id}`;
      opt.textContent = option.title;
      customGroup.appendChild(opt);
    });
    elements.cycleSelect.appendChild(customGroup);
  }
}

/**
 * 주기 관리 목록 렌더링
 * @param {Array} customOptions - 커스텀 주기 옵션
 */
export function renderCycleList(customOptions) {
  elements.cycleList.innerHTML = '';

  if (!customOptions || customOptions.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'cycle-item-empty';
    emptyItem.textContent = '생성된 커스텀 주기가 없습니다.';
    elements.cycleList.appendChild(emptyItem);
    return;
  }

  customOptions.forEach(option => {
    const li = document.createElement('li');
    li.className = 'cycle-item';
    li.setAttribute('data-id', option.id);

    const info = document.createElement('div');
    info.className = 'cycle-info';

    const title = document.createElement('div');
    title.className = 'cycle-title';
    title.textContent = option.title;
    info.appendChild(title);

    const durations = document.createElement('div');
    durations.className = 'cycle-durations';
    durations.textContent = formatDurationsForDisplay(option.durations);
    info.appendChild(durations);

    li.appendChild(info);

    const actions = document.createElement('div');
    actions.className = 'cycle-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-secondary btn-small cycle-edit-btn';
    editBtn.setAttribute('data-id', option.id);
    editBtn.textContent = '수정';
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-small cycle-delete-btn';
    deleteBtn.setAttribute('data-id', option.id);
    deleteBtn.textContent = '삭제';
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    elements.cycleList.appendChild(li);
  });
}

/**
 * 선택된 주기 정보 반환
 * @returns {Object|null} { type, code } 또는 { type, id } 또는 null
 */
export function getSelectedCycle() {
  const value = elements.cycleSelect.value;
  if (!value) return null;

  const [type, identifier] = value.split(':');
  if (type === 'DEFAULT') {
    return { type: 'DEFAULT', code: identifier };
  } else if (type === 'CUSTOM') {
    return { type: 'CUSTOM', id: parseInt(identifier, 10) };
  }
  return null;
}
