import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { api } from 'api';
import VulnerabilitiesDetails from 'components/Tag/Tabs/VulnerabilitiesDetails';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const StateVulnerabilitiesWrapper = () => {
  return (
    <MemoryRouter>
      <VulnerabilitiesDetails name="mongo" />
    </MemoryRouter>
  );
};

const mockCVEList = {
  CVEListForImage: {
    Tag: '',
    Page: { ItemCount: 20, TotalCount: 20 },
    CVEList: [
      {
        Id: 'CVE-2020-16156',
        Title: 'perl-CPAN: Bypass of verification of signatures in CHECKSUMS files',
        Description: 'CPAN 2.28 allows Signature Verification Bypass.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'perl-base',
            InstalledVersion: '5.30.0-9ubuntu0.2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-36222',
        Title:
          'krb5: Sending a request containing PA-ENCRYPTED-CHALLENGE padata element without using FAST could result in NULL dereference in KDC which leads to DoS',
        Description:
          'ec_verify in kdc/kdc_preauth_ec.c in the Key Distribution Center (KDC) in MIT Kerberos 5 (aka krb5) before 1.18.4 and 1.19.x before 1.19.2 allows remote attackers to cause a NULL pointer dereference and daemon crash. This occurs because a return value is not properly managed in a certain situation.',
        Severity: 'HIGH',
        PackageList: [
          {
            Name: 'krb5-locales',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi-krb5-2',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libk5crypto3',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-3',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5support0',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-4209',
        Title: 'GnuTLS: Null pointer dereference in MD_UPDATE',
        Description:
          "A NULL pointer dereference flaw was found in GnuTLS. As Nettle's hash update functions internally call memcpy, providing zero-length input may cause undefined behavior. This flaw leads to a denial of service after authentication in rare circumstances.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libgnutls30',
            InstalledVersion: '3.6.13-2ubuntu1.6',
            FixedVersion: '3.6.13-2ubuntu1.7'
          }
        ]
      },
      {
        Id: 'CVE-2022-1586',
        Title: 'pcre2: Out-of-bounds read in compile_xclass_matchingpath in pcre2_jit_compile.c',
        Description:
          'An out-of-bounds read vulnerability was discovered in the PCRE2 library in the compile_xclass_matchingpath() function of the pcre2_jit_compile.c file. This involves a unicode property matching issue in JIT-compiled regular expressions. The issue occurs because the character was not fully read in case-less matching within JIT.',
        Severity: 'CRITICAL',
        PackageList: [
          {
            Name: 'libpcre2-8-0',
            InstalledVersion: '10.34-7',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-20223',
        Title: '',
        Description:
          'An issue was found in fts5UnicodeTokenize() in ext/fts5/fts5_tokenize.c in Sqlite. A unicode61 tokenizer configured to treat unicode "control-characters" (class Cc), was treating embedded nul characters as tokens. The issue was fixed in sqlite-3.34.0 and later.',
        Severity: 'NONE',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2017-11164',
        Title: 'pcre: OP_KETRMAX feature in the match function in pcre_exec.c',
        Description:
          'In PCRE 8.41, the OP_KETRMAX feature in the match function in pcre_exec.c allows stack exhaustion (uncontrolled recursion) when processing a crafted regular expression.',
        Severity: 'UNKNOWN',
        PackageList: [
          {
            Name: 'libpcre3',
            InstalledVersion: '2:8.39-12ubuntu0.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2020-35527',
        Title: 'sqlite: Out of bounds access during table rename',
        Description:
          'In SQLite 3.31.1, there is an out of bounds access problem through ALTER TABLE for views that have a nested FROM clause.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2013-4235',
        Title: 'shadow-utils: TOCTOU race conditions by copying and removing directory trees',
        Description:
          'shadow: TOCTOU (time-of-check time-of-use) race condition when copying and removing directory trees',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'login',
            InstalledVersion: '1:4.8.1-1ubuntu5.20.04.2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'passwd',
            InstalledVersion: '1:4.8.1-1ubuntu5.20.04.2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-43618',
        Title: 'gmp: Integer overflow and resultant buffer overflow via crafted input',
        Description:
          'GNU Multiple Precision Arithmetic Library (GMP) through 6.2.1 has an mpz/inp_raw.c integer overflow and resultant buffer overflow via crafted input, leading to a segmentation fault on 32-bit platforms.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libgmp10',
            InstalledVersion: '2:6.2.0+dfsg-4',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-2509',
        Title: 'gnutls: Double free during gnutls_pkcs7_verify.',
        Description:
          'A vulnerability found in gnutls. This security flaw happens because of a double free error occurs during verification of pkcs7 signatures in gnutls_pkcs7_verify function.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libgnutls30',
            InstalledVersion: '3.6.13-2ubuntu1.6',
            FixedVersion: '3.6.13-2ubuntu1.7'
          }
        ]
      },
      {
        Id: 'CVE-2021-39537',
        Title: 'ncurses: heap-based buffer overflow in _nc_captoinfo() in captoinfo.c',
        Description:
          'An issue was discovered in ncurses through v6.2-1. _nc_captoinfo in captoinfo.c has a heap-based buffer overflow.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libncurses6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libncursesw6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libtinfo6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-base',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-bin',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-1587',
        Title: 'pcre2: Out-of-bounds read in get_recurse_data_length in pcre2_jit_compile.c',
        Description:
          'An out-of-bounds read vulnerability was discovered in the PCRE2 library in the get_recurse_data_length() function of the pcre2_jit_compile.c file. This issue affects recursions in JIT-compiled regular expressions caused by duplicate data transfers.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libpcre2-8-0',
            InstalledVersion: '10.34-7',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-29458',
        Title: 'ncurses: segfaulting OOB read',
        Description:
          'ncurses 6.3 before patch 20220416 has an out-of-bounds read and segmentation violation in convert_strings in tinfo/read_entry.c in the terminfo library.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libncurses6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libncursesw6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libtinfo6',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-base',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'ncurses-bin',
            InstalledVersion: '6.2-0ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2016-2781',
        Title: 'coreutils: Non-privileged session can escape to the parent session in chroot',
        Description:
          "chroot in GNU coreutils, when used with --userspec, allows local users to escape to the parent session via a crafted TIOCSTI ioctl call, which pushes characters to the terminal's input buffer.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'coreutils',
            InstalledVersion: '8.30-3ubuntu2',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2021-3671',
        Title: 'samba: Null pointer dereference on missing sname in TGS-REQ',
        Description:
          'A null pointer de-reference was found in the way samba kerberos server handled missing sname in TGS-REQ (Ticket Granting Server - Request). An authenticated user could use this flaw to crash the samba server.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libasn1-8-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi3-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libhcrypto4-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libheimbase1-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libheimntlm0-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libhx509-5-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-26-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libroken18-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libwind0-heimdal',
            InstalledVersion: '7.7.0+dfsg-1ubuntu1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2016-20013',
        Title: '',
        Description:
          "sha256crypt and sha512crypt through 0.6 allow attackers to cause a denial of service (CPU consumption) because the algorithm's runtime is proportional to the square of the length of the password.",
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libc-bin',
            InstalledVersion: '2.31-0ubuntu9.9',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libc6',
            InstalledVersion: '2.31-0ubuntu9.9',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2022-35252',
        Title: 'curl: control code in cookie denial of service',
        Description: 'No description is available for this CVE.',
        Severity: 'LOW',
        PackageList: [
          {
            Name: 'libcurl4',
            InstalledVersion: '7.68.0-1ubuntu2.12',
            FixedVersion: '7.68.0-1ubuntu2.13'
          }
        ]
      },
      {
        Id: 'CVE-2021-37750',
        Title:
          'krb5: NULL pointer dereference in process_tgs_req() in kdc/do_tgs_req.c via a FAST inner body that lacks server field',
        Description:
          'The Key Distribution Center (KDC) in MIT Kerberos 5 (aka krb5) before 1.18.5 and 1.19.x before 1.19.3 has a NULL pointer dereference in kdc/do_tgs_req.c via a FAST inner body that lacks a server field.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'krb5-locales',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libgssapi-krb5-2',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libk5crypto3',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5-3',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          },
          {
            Name: 'libkrb5support0',
            InstalledVersion: '1.17-6ubuntu4.1',
            FixedVersion: 'Not Specified'
          }
        ]
      },
      {
        Id: 'CVE-2020-35525',
        Title: 'sqlite: Null pointer derreference in src/select.c',
        Description:
          'In SQlite 3.31.1, a potential null pointer derreference was found in the INTERSEC query processing.',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'libsqlite3-0',
            InstalledVersion: '3.31.1-4ubuntu0.3',
            FixedVersion: '3.31.1-4ubuntu0.4'
          }
        ]
      },
      {
        Id: 'CVE-2022-37434',
        Title:
          'zlib: a heap-based buffer over-read or buffer overflow in inflate in inflate.c via a large gzip header extra field',
        Description:
          'zlib through 1.2.12 has a heap-based buffer over-read or buffer overflow in inflate in inflate.c via a large gzip header extra field. NOTE: only applications that call inflateGetHeader are affected. Some common applications bundle the affected zlib source code but may be unable to call inflateGetHeader (e.g., see the nodejs/node reference).',
        Severity: 'MEDIUM',
        PackageList: [
          {
            Name: 'zlib1g',
            InstalledVersion: '1:1.2.11.dfsg-2ubuntu1.3',
            FixedVersion: 'Not Specified'
          }
        ]
      }
    ]
  }
};

const mockCVEFixed = {
  pageOne: {
    ImageListWithCVEFixed: {
      Page: { TotalCount: 5, ItemCount: 3 },
      Results: [
        {
          Tag: '1.0.16'
        },
        {
          Tag: '0.4.33'
        },
        {
          Tag: '1.0.17'
        }
      ]
    }
  },
  pageTwo: {
    ImageListWithCVEFixed: {
      Page: { TotalCount: 5, ItemCount: 2 },
      Results: [
        {
          Tag: 'slim'
        },
        {
          Tag: 'latest'
        }
      ]
    }
  }
};

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Vulnerabilties page', () => {
  it('renders the vulnerabilities if there are any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    await waitFor(() => expect(screen.getAllByText(/fixed in/i)).toHaveLength(20));
  });

  it('renders no vulnerabilities if there are not any', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({
      status: 200,
      data: { data: { CVEListForImage: { Tag: '', Page: {}, CVEList: [] } } }
    });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('No Vulnerabilities')).toHaveLength(1));
  });

  it('should open and close description dropdown for vulnerabilities', async () => {
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockCVEList } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText(/description/i)).toHaveLength(20));
    const openText = screen.getAllByText(/description/i);
    await fireEvent.click(openText[0]);
    await waitFor(() =>
      expect(screen.getAllByText(/CPAN 2.28 allows Signature Verification Bypass./i)).toHaveLength(1)
    );
    fireEvent.click(openText[0]);
    await waitFor(() =>
      expect(screen.queryByText(/CPAN 2.28 allows Signature Verification Bypass./i)).not.toBeInTheDocument()
    );
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });

  it('should find out which version fixes the CVEs', async () => {
    jest
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } })
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEFixed.pageOne } })
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEFixed.pageTwo } });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    await fireEvent.click(screen.getAllByText(/fixed in/i)[0]);
    await waitFor(() => expect(screen.getByText('1.0.16')).toBeInTheDocument());
    const loadMoreBtn = screen.getByText(/load more/i);
    expect(loadMoreBtn).toBeInTheDocument();
    await fireEvent.click(loadMoreBtn);
    await waitFor(() => expect(loadMoreBtn).not.toBeInTheDocument());
    await expect(await screen.findByText('latest')).toBeInTheDocument();
  });

  it('should handle fixed CVE query errors', async () => {
    jest
      .spyOn(api, 'get')
      .mockResolvedValueOnce({ status: 200, data: { data: mockCVEList } })
      .mockRejectedValue({ status: 500, data: {} });
    render(<StateVulnerabilitiesWrapper />);
    await waitFor(() => expect(screen.getAllByText('Vulnerabilities')).toHaveLength(1));
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    await fireEvent.click(screen.getAllByText(/fixed in/i)[0]);
    await waitFor(() => expect(screen.getByText(/not fixed/i)).toBeInTheDocument());
    await waitFor(() => expect(error).toBeCalledTimes(1));
  });
});
